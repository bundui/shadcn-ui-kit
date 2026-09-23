"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/guards/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { IconHistory, IconLink, IconMail, IconSend, IconSearch, IconUsers, IconDeviceDesktop, IconCheck, IconX, IconPointFilled, IconLayoutDashboard } from "@tabler/icons-react";
import { searchUsersForNotification } from "@/lib/services/notification.service";
import { getProduct } from "@/lib/services/product.service";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { generateEmailHtml, EmailType } from "@/lib/utils/email-templates";
import { cn } from "@/lib/utils";
import Image from "next/image";

type SendMode = "all" | "selected";

type RecipientOption = {
    id: string;
    full_name?: string;
    email?: string;
};

type ProductOption = {
    id: string;
    name?: string;
    slug?: string | null;
};

type EmailSendResult = {
    to: string;
    success: boolean;
    error?: string;
};

type EmailHistoryItem = {
    id: string;
    createdAt: string;
    mode: SendMode;
    subject: string;
    message: string;
    link?: string;
    emailType?: EmailType;
    recipientsTotal: number;
    successCount: number;
    failureCount: number;
    results: EmailSendResult[];
};

function buildFullDestinationLink(rawLink: string): string {
    const value = rawLink.trim();
    if (!value) return "";

    if (/^https?:\/\//i.test(value)) {
        return value;
    }

    const baseUrl =
        (typeof window !== "undefined" ? window.location.origin : "") ||
        process.env.NEXT_PUBLIC_APP_URL ||
        "";

    if (!baseUrl) {
        return value.startsWith("/") ? value : `/${value}`;
    }

    const normalizedPath = value.startsWith("/") ? value : `/${value}`;
    return `${baseUrl}${normalizedPath}`;
}

function NotificationsPageContent() {
    const [sendMode, setSendMode] = useState<SendMode>("all");
    const [emailType, setEmailType] = useState<EmailType>("marketing");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [link, setLink] = useState("");
    const [recipientQuery, setRecipientQuery] = useState("");
    const [recipientSuggestions, setRecipientSuggestions] = useState<RecipientOption[]>([]);
    const [selectedRecipients, setSelectedRecipients] = useState<RecipientOption[]>([]);
    const [searchingRecipients, setSearchingRecipients] = useState(false);
    const [showRecipientDropdown, setShowRecipientDropdown] = useState(false);
    const [sending, setSending] = useState(false);
    const [lastResult, setLastResult] = useState<null | {
        successCount?: number;
        failureCount?: number;
        results?: EmailSendResult[];
    }>(null);
    const [emailHistory, setEmailHistory] = useState<EmailHistoryItem[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [linkMode, setLinkMode] = useState<"manual" | "preset" | "product">("manual");
    const [productQuery, setProductQuery] = useState("");
    const [productSuggestions, setProductSuggestions] = useState<ProductOption[]>([]);
    const [searchingProducts, setSearchingProducts] = useState(false);
    const [showProductDropdown, setShowProductDropdown] = useState(false);
    const fullDestinationLink = buildFullDestinationLink(link);

    const presetLinks = [
        { label: "Trang chủ", value: "/" },
        { label: "Danh sách sản phẩm", value: "/products" },
        { label: "Giỏ hàng", value: "/cart" },
        { label: "Thanh toán", value: "/checkout" },
        { label: "Tài khoản", value: "/account" },
    ];

    const fetchEmailHistory = async () => {
        setLoadingHistory(true);
        try {
            const response = await fetch("/api/email/bulk", { method: "GET" });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Không thể tải lịch sử gửi email.");
            }
            setEmailHistory(Array.isArray(data.history) ? data.history : []);
        } catch (error: any) {
            toast.error(error?.message || "Không thể tải lịch sử gửi email.");
        } finally {
            setLoadingHistory(false);
        }
    };

    useEffect(() => {
        fetchEmailHistory();
    }, []);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!recipientQuery.trim() || sendMode !== "selected") {
                setRecipientSuggestions([]);
                return;
            }

            setSearchingRecipients(true);
            const { data } = await searchUsersForNotification(recipientQuery.trim());
            setRecipientSuggestions((data as RecipientOption[]) ?? []);
            setSearchingRecipients(false);
            setShowRecipientDropdown(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [recipientQuery, sendMode]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!productQuery.trim() || linkMode !== "product") {
                setProductSuggestions([]);
                return;
            }

            setSearchingProducts(true);
            const { data } = await getProduct(productQuery.trim(), 1, 5);
            setProductSuggestions((data as ProductOption[]) ?? []);
            setSearchingProducts(false);
            setShowProductDropdown(true);
        }, 300);

        return () => clearTimeout(timer);
    }, [productQuery, linkMode]);

    const handleSelectRecipient = (recipient: RecipientOption) => {
        if (!recipient.email) return;
        setSelectedRecipients((current) => {
            if (current.some((item) => item.email === recipient.email)) {
                return current;
            }
            return [...current, recipient];
        });
        setRecipientQuery("");
        setShowRecipientDropdown(false);
    };

    const handleRemoveRecipient = (email?: string) => {
        if (!email) return;
        setSelectedRecipients((current) => current.filter((item) => item.email !== email));
    };

    const handleSelectPresetLink = (value: string) => {
        setLink(value);
        setLinkMode("preset");
    };

    const handleSelectProduct = (product: ProductOption) => {
        const productLink = product.slug ? `/product/${product.slug}` : `/product/${product.id}`;
        setLink(productLink);
        setProductQuery(product.name || product.slug || product.id);
        setLinkMode("product");
        setShowProductDropdown(false);
    };

    const handleSend = async () => {
        if (!subject.trim() || !message.trim()) {
            toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
            return;
        }

        if (sendMode === "selected" && selectedRecipients.length === 0) {
            toast.error("Vui lòng chọn ít nhất một người nhận.");
            return;
        }

        setSending(true);
        try {
            const response = await fetch("/api/email/bulk", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: sendMode,
                    subject: subject.trim(),
                    message: message.trim(),
                    link: fullDestinationLink || undefined,
                    emailType,
                    recipients: sendMode === "selected" ? selectedRecipients.map((recipient) => recipient.email).filter((email): email is string => Boolean(email)) : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Đã xảy ra lỗi khi gửi email.");
            }

            setLastResult({
                successCount: data.successCount,
                failureCount: data.failureCount,
                results: data.results,
            });

            await fetchEmailHistory();

            toast.success(
                sendMode === "all"
                    ? `Đã gửi mail hàng loạt tới ${data.successCount || 0} người nhận.`
                    : `Đã gửi mail tới ${selectedRecipients.length} người nhận.`
            );

            setSubject("");
            setMessage("");
            setLink("");
            if (sendMode === "selected") {
                setRecipientQuery("");
                setRecipientSuggestions([]);
                setSelectedRecipients([]);
            }

            setLinkMode("manual");
            setProductQuery("");
            setProductSuggestions([]);
        } catch (error: any) {
            toast.error(error?.message || "Đã xảy ra lỗi khi gửi email.");
        } finally {
            setSending(false);
        }
    };

    const formatDateTime = (isoDate: string) => {
        return new Date(isoDate).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    // Shared card classes to match standard style
    const luxeCardClass = "bg-card/50 backdrop-blur-xl border border-border/50 shadow-sm rounded-[24px] overflow-hidden";

    return (
        <div className="space-y-6 pb-8 animate-fade-in">
            {/* Header đồng bộ với các trang khác */}
            <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
                <div className="relative z-10">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
                        Chiến dịch Email
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium">
                        Tạo và gửi các chiến dịch marketing hoặc thông báo quan trọng đến người dùng.
                    </p>
                </div>
            </div>

            <Tabs defaultValue="compose" className="space-y-6">
                {/* TabsList đồng bộ với LuxeCommerce (Bo cong, nền blur) */}
                <TabsList className="flex w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-auto p-1.5 gap-2 justify-start sm:grid sm:grid-cols-2 sm:max-w-md bg-muted/50 rounded-full border border-border/50 shadow-inner">
                    <TabsTrigger value="compose" className="gap-2 shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold flex-1 cursor-pointer rounded-full data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all">
                        <IconSend className="size-4" /> Soạn email
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2 shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold flex-1 cursor-pointer rounded-full data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all">
                        <IconHistory className="size-4" /> Lịch sử gửi
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-6 focus-visible:outline-none">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
                        {/* CỘT TRÁI: FORM (7 columns) */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Khối 1: Đối tượng */}
                            <Card className={luxeCardClass}>
                                <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-t-[24px]"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-blue-500/10 text-blue-600">
                                            <Image src="/icons/people.png" alt="Notify" width={22} height={22} />
                                        </div>
                                        Đối tượng nhận
                                    </CardTitle>
                                    <CardDescription>Chọn nhóm người dùng hoặc nhập email cụ thể để nhận thông báo.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex flex-col gap-2 sm:flex-row bg-background/50 p-1.5 rounded-[20px] border border-border/50">
                                        <Button
                                            type="button"
                                            variant={sendMode === "all" ? "default" : "ghost"}
                                            onClick={() => setSendMode("all")}
                                            className={cn("flex-1 gap-2 rounded-[14px] transition-all h-10", sendMode === "all" ? "shadow-sm bg-primary text-white dark:text-black hover:bg-primary/80 hover:text-white" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            <IconUsers className="size-4" /> Gửi toàn hệ thống
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={sendMode === "selected" ? "default" : "ghost"}
                                            onClick={() => setSendMode("selected")}
                                            className={cn("flex-1 gap-2 rounded-[14px] transition-all h-10", sendMode === "selected" ? "shadow-sm bg-primary text-white dark:text-black hover:bg-primary/80 hover:text-white" : "text-muted-foreground hover:text-foreground")}
                                        >
                                            <IconMail className="size-4" /> Gửi tuỳ chỉnh
                                        </Button>
                                    </div>

                                    {sendMode === "selected" && (
                                        <div className="space-y-3 pt-2 relative animate-in slide-in-from-top-2 fade-in duration-300">
                                            <div className="relative">
                                                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                <Input
                                                    id="recipientSearch"
                                                    type="text"
                                                    placeholder="Gõ tên hoặc email, rồi bấm để thêm..."
                                                    value={recipientQuery}
                                                    onChange={(event) => {
                                                        setRecipientQuery(event.target.value);
                                                        setShowRecipientDropdown(true);
                                                    }}
                                                    onFocus={() => setShowRecipientDropdown(true)}
                                                    className="pl-10 h-12 rounded-[16px] bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm"
                                                />
                                            </div>

                                            {selectedRecipients.length > 0 && (
                                                <div className="flex flex-wrap gap-2 p-3 rounded-[16px] border border-border/50 bg-background/50">
                                                    {selectedRecipients.map((recipient) => (
                                                        <button
                                                            key={recipient.email || recipient.id}
                                                            type="button"
                                                            onClick={() => handleRemoveRecipient(recipient.email)}
                                                            className="group inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 px-3 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-500/10"
                                                            title="Bấm để bỏ chọn"
                                                        >
                                                            <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600">
                                                                <IconUsers className="size-2.5" />
                                                            </div>
                                                            <span className="max-w-[150px] truncate">{recipient.full_name || recipient.email}</span>
                                                            <IconX className="size-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {showRecipientDropdown && recipientQuery.trim() && (
                                                <div className="absolute left-0 right-0 top-[48px] z-50 max-h-56 overflow-y-auto rounded-[16px] border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl">
                                                    {searchingRecipients ? (
                                                        <div className="px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
                                                            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span> Đang tìm...
                                                        </div>
                                                    ) : recipientSuggestions.length > 0 ? (
                                                        <div className="p-1.5">
                                                            {recipientSuggestions.map((item) => {
                                                                const isSelected = selectedRecipients.some((selected) => selected.email === item.email);
                                                                return (
                                                                    <button
                                                                        key={item.id}
                                                                        type="button"
                                                                        onClick={() => !isSelected && handleSelectRecipient(item)}
                                                                        disabled={isSelected}
                                                                        className={cn(
                                                                            "flex w-full items-center justify-between gap-2 rounded-[12px] px-3 py-2 text-left text-sm transition-colors",
                                                                            isSelected ? "opacity-50 cursor-not-allowed bg-muted/50" : "hover:bg-muted"
                                                                        )}
                                                                    >
                                                                        <div className="flex flex-col">
                                                                            <span className="font-semibold text-foreground">{item.full_name || "Không tên"}</span>
                                                                            <span className="text-xs text-muted-foreground">{item.email || "Không có email"}</span>
                                                                        </div>
                                                                        {isSelected && <IconCheck className="size-4 text-emerald-500" />}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="px-4 py-3 text-sm text-muted-foreground">Không tìm thấy người nhận.</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Khối 2: Template */}
                            <Card className={luxeCardClass}>
                                <div className="h-1 w-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-t-[24px]"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-violet-500/10 text-violet-600">
                                            <Image src="/icons/ui.png" alt="Notify" width={22} height={22} />
                                        </div>
                                        Giao diện mẫu
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <RadioGroup value={emailType} onValueChange={(val) => setEmailType(val as EmailType)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <Label htmlFor="type-marketing" className="cursor-pointer group h-full">
                                            <div className={cn("relative flex flex-col p-4 border-2 rounded-[20px] transition-all h-full", emailType === "marketing" ? "border-violet-500 bg-violet-500/5 shadow-md shadow-violet-500/10" : "border-border/50 hover:border-violet-500/50 bg-background/30")}>
                                                <RadioGroupItem value="marketing" id="type-marketing" className="absolute right-3 top-3 data-[state=checked]:border-violet-600 data-[state=checked]:text-violet-600" />
                                                <Image src="/icons/marketing.png" alt="Icon" width={50} height={50} />
                                                <div className="font-bold text-sm text-foreground mt-2">Marketing</div>
                                                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Sự kiện, ra mắt sản phẩm, kêu gọi hành động rực rỡ.</div>
                                            </div>
                                        </Label>
                                        <Label htmlFor="type-system" className="cursor-pointer group h-full">
                                            <div className={cn("relative flex flex-col p-4 border-2 rounded-[20px] transition-all h-full", emailType === "system" ? "border-foreground/50 bg-foreground/5 shadow-md" : "border-border/50 hover:border-foreground/30 bg-background/30")}>
                                                <RadioGroupItem value="system" id="type-system" className="absolute right-3 top-3 text-foreground" />
                                                <Image src="/icons/system.png" alt="Icon" width={50} height={50} />
                                                <div className="font-bold text-sm text-foreground mt-2">Hệ thống</div>
                                                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Thông báo bảo mật, quy định, cập nhật kỹ thuật.</div>
                                            </div>
                                        </Label>
                                        <Label htmlFor="type-standard" className="cursor-pointer group h-full">
                                            <div className={cn("relative flex flex-col p-4 border-2 rounded-[20px] transition-all h-full", emailType === "standard" ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border/50 hover:border-primary/50 bg-background/30")}>
                                                <RadioGroupItem value="standard" id="type-standard" className="absolute right-3 top-3 text-primary" />
                                                <Image src="/icons/standard_mail.png" alt="Icon" width={50} height={50} />
                                                <div className="font-bold text-sm text-foreground mt-2">Tiêu chuẩn</div>
                                                <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">Văn bản thuần, đơn giản, giao tiếp hàng ngày.</div>
                                            </div>
                                        </Label>
                                    </RadioGroup>
                                </CardContent>
                            </Card>

                            {/* Khối 3: Nội dung */}
                            <Card className={luxeCardClass}>
                                <div className="h-1 w-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-t-[24px]"></div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <div className="p-1 rounded-full bg-amber-500/10 text-amber-600">
                                            <Image src="/icons/gmail2.png" alt="Notify" width={22} height={22} />
                                        </div>
                                        Nội dung truyền tải
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-5">
                                    <div className="space-y-2">
                                        <Label htmlFor="subject" className="font-semibold text-foreground">Tiêu đề Email</Label>
                                        <Input
                                            id="subject"
                                            placeholder="Ví dụ: Ưu đãi độc quyền tháng 8 dành cho bạn!"
                                            value={subject}
                                            onChange={(event) => setSubject(event.target.value)}
                                            className="h-12 rounded-[16px] bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message" className="font-semibold text-foreground">Nội dung chính</Label>
                                        <Textarea
                                            id="message"
                                            placeholder="Soạn nội dung thông điệp của bạn tại đây..."
                                            className="min-h-[220px] rounded-[16px] bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm resize-y p-4 text-sm leading-relaxed"
                                            value={message}
                                            onChange={(event) => setMessage(event.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-3 pt-2 relative">
                                        <Label htmlFor="link" className="font-semibold text-foreground">Link đính kèm (Nút Call-to-Action)</Label>
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="button" variant={linkMode === "manual" ? "default" : "outline"} size="sm" onClick={() => setLinkMode("manual")} className="gap-2 rounded-full h-9 px-5 text-xs font-semibold shadow-sm">
                                                <IconLink className="size-3.5" /> Thủ công
                                            </Button>
                                            <Button type="button" variant={linkMode === "preset" ? "default" : "outline"} size="sm" onClick={() => setLinkMode("preset")} className="gap-2 rounded-full h-9 px-5 text-xs font-semibold shadow-sm">
                                                <IconLink className="size-3.5" /> Link nhanh
                                            </Button>
                                            <Button type="button" variant={linkMode === "product" ? "default" : "outline"} size="sm" onClick={() => setLinkMode("product")} className="gap-2 rounded-full h-9 px-5 text-xs font-semibold shadow-sm">
                                                <IconSearch className="size-3.5" /> Sản phẩm
                                            </Button>
                                        </div>

                                        {linkMode === "preset" && (
                                            <div className="flex flex-wrap gap-2 p-3 rounded-[16px] bg-background/50 border border-border/50 animate-in fade-in duration-300">
                                                {presetLinks.map((item) => (
                                                    <Button key={item.value} type="button" variant="secondary" size="sm" onClick={() => handleSelectPresetLink(item.value)} className="h-8 text-xs rounded-full shadow-sm">
                                                        {item.label}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}

                                        {linkMode === "product" && (
                                            <div className="space-y-2 relative animate-in fade-in duration-300">
                                                <div className="relative">
                                                    <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                                    <Input
                                                        id="productSearch"
                                                        type="text"
                                                        placeholder="Gõ tên sản phẩm..."
                                                        value={productQuery}
                                                        onChange={(event) => {
                                                            setProductQuery(event.target.value);
                                                            setShowProductDropdown(true);
                                                        }}
                                                        onFocus={() => setShowProductDropdown(true)}
                                                        className="pl-10 h-11 rounded-[16px] bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm"
                                                    />
                                                </div>
                                                {showProductDropdown && productQuery.trim() && (
                                                    <div className="absolute left-0 right-0 bottom-[52px] z-50 max-h-56 overflow-y-auto rounded-[16px] border border-border/50 bg-card/95 backdrop-blur-xl shadow-xl p-1.5">
                                                        {searchingProducts ? (
                                                            <div className="px-3 py-3 text-xs text-muted-foreground flex items-center gap-2">
                                                                <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span> Đang tìm sản phẩm...
                                                            </div>
                                                        ) : productSuggestions.length > 0 ? (
                                                            productSuggestions.map((item) => (
                                                                <button
                                                                    key={item.id}
                                                                    type="button"
                                                                    onClick={() => handleSelectProduct(item)}
                                                                    className="flex w-full items-center justify-between gap-3 rounded-[12px] px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                                                                >
                                                                    <span className="truncate font-semibold text-foreground">{item.name || "Không tên"}</span>
                                                                    <span className="max-w-[40%] truncate text-xs text-muted-foreground bg-background/80 px-2 py-0.5 rounded-md border border-border/50">{item.slug || item.id}</span>
                                                                </button>
                                                            ))
                                                        ) : (
                                                            <div className="px-3 py-3 text-xs text-muted-foreground">Không tìm thấy sản phẩm.</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Input
                                            id="link"
                                            placeholder="/product/abc hoặc https://..."
                                            value={link}
                                            onChange={(event) => setLink(event.target.value)}
                                            disabled={linkMode !== "manual"}
                                            className="h-11 rounded-[16px] bg-background/50 border-border/50 focus-visible:ring-primary/20 shadow-sm"
                                        />
                                        {link.trim() && (
                                            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-500/10 px-3 py-2.5 rounded-[12px] border border-emerald-500/20">
                                                <IconCheck className="size-4 shrink-0" />
                                                <span className="truncate">Link đích: <strong>{fullDestinationLink}</strong></span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 border-t border-border/50 p-5 rounded-b-[24px] flex flex-col sm:flex-row justify-end items-center gap-4">
                                    <div className="text-xs font-medium text-muted-foreground/90 flex items-center gap-2 w-full sm:w-auto">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                                        Xem kỹ Preview bên phải trước khi gửi
                                    </div>
                                    <Button onClick={handleSend} disabled={sending} className="gap-2 w-full sm:w-auto font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all h-11 px-8 rounded-full">
                                        {/* <IconSend className="size-4" /> */}
                                        {sending ? "Đang gửi..." : "Gửi Email Ngay"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                        {/* CỘT PHẢI: LIVE PREVIEW (5 columns) */}
                        <div className="lg:col-span-5 h-[calc(100vh-140px)] sticky top-[90px] hidden lg:flex flex-col">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    <IconDeviceDesktop className="size-4" />
                                    Xem trước trực tiếp
                                </h2>
                            </div>

                            {/* macOS Window Mockup */}
                            <div className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-sm rounded-[24px] overflow-hidden flex-1 flex flex-col transition-all duration-300">
                                {/* Window Header */}
                                <div className="bg-muted/50 border-b border-border/50 flex items-center px-4 py-3 gap-2 shrink-0 backdrop-blur-md">
                                    <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-sm"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-sm"></div>
                                        <div className="w-3 h-3 rounded-full bg-[#27c93f] shadow-sm"></div>
                                    </div>
                                    <div className="mx-auto flex items-center justify-center">
                                        <div className="text-[11px] font-semibold text-muted-foreground bg-background/80 border border-border/50 px-6 py-1 rounded-full shadow-sm truncate max-w-[220px] flex items-center gap-1.5">
                                            <Image src="/icons/title1.png" alt="Icon" width={20} height={20} />
                                            {subject || "Chưa có tiêu đề"}
                                        </div>
                                    </div>
                                    <div className="w-[52px]"></div> {/* Spacer for perfect center balance */}
                                </div>
                                {/* Window Body (Iframe) */}
                                <div className="flex-1 w-full relative bg-background/50 overflow-hidden">
                                    {/* Màn che mờ nếu chưa nhập gì cả */}
                                    {(!subject && !message) && (
                                        <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6">
                                            <div className="w-20 h-20 rounded-full  flex items-center justify-center text-primary mb-4 shadow-sm border border-primary/20">
                                                <Image src="/icons/gmail.png" alt="Icon" width={50} height={50} />
                                            </div>
                                            <p className="font-bold text-foreground text-lg">Bản xem trước đang chờ</p>
                                            <p className="text-sm font-medium text-muted-foreground mt-2 max-w-[250px]">Hãy nhập tiêu đề hoặc nội dung ở cột bên trái để thấy phép thuật xuất hiện tại đây.</p>
                                        </div>
                                    )}
                                    <iframe
                                        srcDoc={generateEmailHtml(emailType, subject || "Tiêu đề email", message || "Nội dung email sẽ hiển thị ở đây...", fullDestinationLink)}
                                        className="w-full h-full border-0 absolute inset-0 bg-transparent"
                                        title="Email Preview"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Preview Modal (Chỉ hiện trên điện thoại) */}
                        <div className="lg:hidden col-span-1">
                            <div className="rounded-[24px] border border-blue-500/20 bg-blue-500/5 backdrop-blur-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-blue-500/10 rounded-[14px] text-blue-600">
                                        <IconDeviceDesktop className="size-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-900 dark:text-blue-100">Xem giao diện thực tế</p>
                                        <p className="text-xs font-medium text-blue-700/70 dark:text-blue-300/70">Kiểm tra cách email hiển thị trước khi gửi đi</p>
                                    </div>
                                </div>
                                <Button type="button" variant="default" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg shadow-blue-600/20 px-6 h-10">
                                    Mở bản xem trước
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Kết quả gửi gần nhất */}
                    {lastResult && (
                        <div className="mt-6 rounded-[24px] border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-xl p-5 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 rounded-[14px] bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                    <IconCheck className="size-5" />
                                </div>
                                <div>
                                    <h3 className="font-extrabold text-emerald-800 dark:text-emerald-300 text-base">Chiến dịch vừa gửi hoàn tất</h3>
                                    <p className="text-sm font-medium text-emerald-600/80 dark:text-emerald-400/80">Thành công: {lastResult.successCount || 0} &bull; Thất bại: {lastResult.failureCount || 0}</p>
                                </div>
                            </div>

                            {lastResult.results?.length ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                    {lastResult.results.slice(0, 6).map((item) => (
                                        <div key={item.to} className="flex items-center justify-between rounded-[16px] border border-border/50 bg-background/50 px-4 py-2.5 text-sm shadow-sm hover:bg-muted/50 transition-colors">
                                            <span className="truncate font-semibold text-foreground" title={item.to}>{item.to}</span>
                                            <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", item.success ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600")}>
                                                {item.success ? "OK" : "Lỗi"}
                                            </span>
                                        </div>
                                    ))}
                                    {lastResult.results.length > 6 && (
                                        <div className="flex items-center justify-center rounded-[16px] border border-dashed border-border/50 bg-transparent px-4 py-2.5 text-sm font-medium text-muted-foreground">
                                            + {lastResult.results.length - 6} người nhận khác
                                        </div>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-6 focus-visible:outline-none">
                    <Card className={luxeCardClass}>
                        <CardHeader className="pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <IconHistory className="size-4" />
                                </div>
                                Lịch sử chiến dịch
                            </CardTitle>
                            <CardDescription>
                                Danh sách các đợt gửi email gần nhất kèm theo thống kê chi tiết.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingHistory ? (
                                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground space-y-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                                    <p className="text-sm font-medium">Đang tải dữ liệu lịch sử...</p>
                                </div>
                            ) : emailHistory.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-border/50 rounded-[24px] bg-background/30 group hover:border-primary/50 hover:bg-primary/5 transition-all">
                                    <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mb-5 text-muted-foreground group-hover:scale-110 group-hover:bg-primary/10 group-hover:text-primary transition-all duration-300">
                                        <IconHistory className="size-10" />
                                    </div>
                                    <h3 className="text-xl font-extrabold text-foreground">Chưa có dữ liệu</h3>
                                    <p className="text-sm font-medium text-muted-foreground mt-2 max-w-md leading-relaxed">Bạn chưa thực hiện chiến dịch gửi email nào. Hãy chuyển sang tab Soạn email để bắt đầu chiến dịch đầu tiên.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                    {emailHistory.map((item) => (
                                        <div key={item.id} className="flex flex-col rounded-[24px] border border-border/50 bg-background/50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                                            {/* Trang trí góc */}
                                            <div className={cn("absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[40px] pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-150",
                                                item.emailType === "marketing" ? "bg-violet-500" :
                                                    item.emailType === "system" ? "bg-slate-500" : "bg-blue-500"
                                            )}></div>

                                            <div className="flex justify-between items-start mb-4 relative z-10">
                                                <div className="space-y-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                                            item.emailType === "marketing" ? "bg-violet-500/10 text-violet-600" :
                                                                item.emailType === "system" ? "bg-foreground/10 text-foreground" :
                                                                    "bg-blue-500/10 text-blue-600"
                                                        )}>
                                                            {item.emailType || "Standard"}
                                                        </span>
                                                        <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1">
                                                            <IconPointFilled className="size-2.5" />
                                                            {item.mode === "all" ? "Toàn bộ" : "Tuỳ chỉnh"}
                                                        </span>
                                                    </div>
                                                    <h4 className="font-extrabold text-base text-foreground line-clamp-1 group-hover:text-primary transition-colors" title={item.subject}>{item.subject}</h4>
                                                    <p className="text-xs font-medium text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-3 text-center mb-5 relative z-10">
                                                <div className="rounded-[16px] bg-background/80 p-2.5 border border-border/50 shadow-sm">
                                                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Tổng</div>
                                                    <div className="font-black text-base text-foreground">{item.recipientsTotal}</div>
                                                </div>
                                                <div className="rounded-[16px] bg-emerald-500/5 p-2.5 border border-emerald-500/20 shadow-sm">
                                                    <div className="text-[10px] uppercase font-bold text-emerald-600 mb-1">Thành công</div>
                                                    <div className="font-black text-base text-emerald-600">{item.successCount}</div>
                                                </div>
                                                <div className="rounded-[16px] bg-red-500/5 p-2.5 border border-red-500/20 shadow-sm">
                                                    <div className="text-[10px] uppercase font-bold text-red-600 mb-1">Thất bại</div>
                                                    <div className="font-black text-base text-red-600">{item.failureCount}</div>
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-4 border-t border-dashed border-border/50 space-y-3 relative z-10">
                                                <div className="text-sm font-medium text-muted-foreground line-clamp-2 italic">
                                                    &quot;{item.message}&quot;
                                                </div>
                                                {item.link && (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                                        <IconLink className="size-3.5" /> Xem link đính kèm
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default function NotificationsPage() {
    return (
        <RoleGuard allowedRoles={["admin"]}>
            <NotificationsPageContent />
        </RoleGuard>
    );
}