"use client";

import { useEffect, useState } from "react";
import RoleGuard from "@/components/guards/role-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { IconHistory, IconLink, IconMail, IconSend, IconSearch, IconUsers } from "@tabler/icons-react";
import { searchUsersForNotification } from "@/lib/services/notification.service";
import { getProduct } from "@/lib/services/product.service";

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

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Gửi Mail Hàng Loạt</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                    Màn này thay cho notifications nội bộ. Dùng để gửi email marketing hoặc email riêng lẻ từ dashboard.
                </p>
            </div>

            <Tabs defaultValue="compose" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compose" className="gap-2">
                        <IconSend className="size-4" /> Soạn email
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2">
                        <IconHistory className="size-4" /> Lịch sử gửi email
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="compose">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trình gửi email</CardTitle>
                            <CardDescription>
                                Chọn gửi cho toàn bộ người dùng hoặc nhập một email cụ thể để test.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3 rounded-xl border bg-secondary/30 p-4">
                                <Label className="block text-sm font-semibold">Đối tượng nhận:</Label>
                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <Button
                                        type="button"
                                        variant={sendMode === "all" ? "default" : "outline"}
                                        onClick={() => setSendMode("all")}
                                        className="flex-1 gap-2"
                                    >
                                        <IconUsers className="size-4" /> Tất cả người dùng
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={sendMode === "selected" ? "default" : "outline"}
                                        onClick={() => setSendMode("selected")}
                                        className="flex-1 gap-2"
                                    >
                                        <IconMail className="size-4" /> Email cụ thể
                                    </Button>
                                </div>

                                {sendMode === "selected" && (
                                    <div className="space-y-2 pt-2 relative">
                                        <Label htmlFor="recipientSearch">Tìm và chọn người nhận</Label>
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
                                        />
                                        {selectedRecipients.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {selectedRecipients.map((recipient) => (
                                                    <button
                                                        key={recipient.email || recipient.id}
                                                        type="button"
                                                        onClick={() => handleRemoveRecipient(recipient.email)}
                                                        className="inline-flex items-center gap-2 rounded-full border bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
                                                        title="Bấm để bỏ chọn"
                                                    >
                                                        <span className="max-w-[180px] truncate">{recipient.full_name || recipient.email}</span>
                                                        <span aria-hidden="true">×</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {showRecipientDropdown && recipientQuery.trim() && (
                                            <div className="absolute left-0 right-0 top-[72px] z-20 max-h-56 overflow-y-auto rounded-md border bg-popover shadow-md">
                                                {searchingRecipients ? (
                                                    <div className="px-3 py-2 text-xs text-muted-foreground">Đang tìm...</div>
                                                ) : recipientSuggestions.length > 0 ? (
                                                    recipientSuggestions.map((item) => (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => handleSelectRecipient(item)}
                                                            className="flex w-full items-center justify-between gap-2 border-b px-3 py-2 text-left text-xs last:border-0 hover:bg-muted"
                                                        >
                                                            <span className="truncate font-medium">{item.full_name || "Không tên"}</span>
                                                            <span className="max-w-[55%] truncate text-muted-foreground">
                                                                {selectedRecipients.some((selected) => selected.email === item.email) ? "Đã chọn" : item.email || "Không có email"}
                                                            </span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-xs text-muted-foreground">Không tìm thấy người nhận.</div>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Mỗi lần chọn sẽ được thêm vào danh sách, bấm vào chip để bỏ chọn.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Tiêu đề</Label>
                                <Input
                                    id="subject"
                                    placeholder="Ví dụ: Ưu đãi mới trong tuần này"
                                    value={subject}
                                    onChange={(event) => setSubject(event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Nội dung</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Nhập nội dung email..."
                                    className="min-h-[180px]"
                                    value={message}
                                    onChange={(event) => setMessage(event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="link">Link đính kèm</Label>
                                <div className="flex flex-wrap gap-2">
                                    <Button type="button" variant={linkMode === "manual" ? "default" : "outline"} size="sm" onClick={() => setLinkMode("manual")} className="gap-2">
                                        <IconLink className="size-4" /> Nhập thủ công
                                    </Button>
                                    <Button type="button" variant={linkMode === "preset" ? "default" : "outline"} size="sm" onClick={() => setLinkMode("preset")} className="gap-2">
                                        <IconLink className="size-4" /> Link nhanh
                                    </Button>
                                    <Button type="button" variant={linkMode === "product" ? "default" : "outline"} size="sm" onClick={() => setLinkMode("product")} className="gap-2">
                                        <IconSearch className="size-4" /> Chọn sản phẩm
                                    </Button>
                                </div>

                                {linkMode === "preset" && (
                                    <div className="flex flex-wrap gap-2">
                                        {presetLinks.map((item) => (
                                            <Button key={item.value} type="button" variant="outline" size="sm" onClick={() => handleSelectPresetLink(item.value)}>
                                                {item.label}
                                            </Button>
                                        ))}
                                    </div>
                                )}

                                {linkMode === "product" && (
                                    <div className="space-y-2 relative">
                                        <Label htmlFor="productSearch">Tìm sản phẩm</Label>
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
                                        />
                                        {showProductDropdown && productQuery.trim() && (
                                            <div className="absolute left-0 right-0 top-[72px] z-20 max-h-56 overflow-y-auto rounded-md border bg-popover shadow-md">
                                                {searchingProducts ? (
                                                    <div className="px-3 py-2 text-xs text-muted-foreground">Đang tìm sản phẩm...</div>
                                                ) : productSuggestions.length > 0 ? (
                                                    productSuggestions.map((item) => (
                                                        <button
                                                            key={item.id}
                                                            type="button"
                                                            onClick={() => handleSelectProduct(item)}
                                                            className="flex w-full items-center justify-between gap-2 border-b px-3 py-2 text-left text-xs last:border-0 hover:bg-muted"
                                                        >
                                                            <span className="truncate font-medium">{item.name || "Không tên"}</span>
                                                            <span className="max-w-[55%] truncate text-muted-foreground">{item.slug || item.id}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-3 py-2 text-xs text-muted-foreground">Không tìm thấy sản phẩm.</div>
                                                )}
                                            </div>
                                        )}
                                        <p className="text-xs text-muted-foreground">Chọn sản phẩm để tự chèn link chi tiết nhanh hơn.</p>
                                    </div>
                                )}

                                <Input
                                    id="link"
                                    placeholder="/product/abc hoặc https://..."
                                    value={link}
                                    onChange={(event) => setLink(event.target.value)}
                                    disabled={linkMode !== "manual"}
                                />
                                {link.trim() && (
                                    <p className="text-xs text-muted-foreground break-all">
                                        Link đích đầy đủ: {fullDestinationLink}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Mail sẽ được gửi qua server API, dùng Gmail App Password đã cấu hình trong môi trường.
                                </p>
                                <Button onClick={handleSend} disabled={sending} className="gap-2">
                                    <IconSend className="size-4" />
                                    {sending ? "Đang gửi..." : "Gửi email"}
                                </Button>
                            </div>

                            {lastResult && (
                                <div className="rounded-xl border bg-muted/30 p-4 text-sm">
                                    <p className="font-semibold">Kết quả lần gửi gần nhất</p>
                                    <p className="mt-1 text-muted-foreground">
                                        Thành công: {lastResult.successCount || 0} | Thất bại: {lastResult.failureCount || 0}
                                    </p>
                                    {lastResult.results?.length ? (
                                        <div className="mt-3 space-y-2">
                                            {lastResult.results.slice(0, 5).map((item) => (
                                                <div key={item.to} className="flex items-center justify-between rounded-lg border bg-background px-3 py-2 text-xs">
                                                    <span className="truncate">{item.to}</span>
                                                    <span className={item.success ? "text-emerald-600" : "text-red-600"}>
                                                        {item.success ? "Đã gửi" : item.error || "Lỗi"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="history">
                    <Card>
                        <CardHeader>
                            <CardTitle>Lịch sử gửi email</CardTitle>
                            <CardDescription>
                                Danh sách lịch sử gửi gần nhất với đầy đủ thông tin chiến dịch và kết quả từng người nhận.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {loadingHistory ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    Đang tải lịch sử gửi email...
                                </div>
                            ) : emailHistory.length === 0 ? (
                                <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
                                    Chưa có lịch sử gửi email.
                                </div>
                            ) : (
                                emailHistory.map((item) => (
                                    <div key={item.id} className="space-y-3 rounded-xl border p-4">
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <p className="text-sm font-semibold">{item.subject}</p>
                                                <p className="text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {item.mode === "all" ? "Gửi toàn bộ" : "Gửi email cụ thể"}
                                            </div>
                                        </div>

                                        <div className="grid gap-2 text-xs sm:grid-cols-3">
                                            <div className="rounded-md bg-muted/40 p-2">Tổng người nhận: {item.recipientsTotal}</div>
                                            <div className="rounded-md bg-emerald-50 p-2 text-emerald-700">Thành công: {item.successCount}</div>
                                            <div className="rounded-md bg-red-50 p-2 text-red-700">Thất bại: {item.failureCount}</div>
                                        </div>

                                        <div className="space-y-1 text-xs">
                                            <p><span className="font-medium">Nội dung:</span> {item.message}</p>
                                            <p>
                                                <span className="font-medium">Link đích:</span>{" "}
                                                {item.link ? (
                                                    <a href={item.link} target="_blank" rel="noreferrer" className="break-all text-primary underline-offset-2 hover:underline">
                                                        {item.link}
                                                    </a>
                                                ) : (
                                                    "Không có"
                                                )}
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-xs font-medium">Chi tiết người nhận</p>
                                            <div className="max-h-52 space-y-1 overflow-y-auto rounded-md border bg-muted/20 p-2">
                                                {item.results.length > 0 ? (
                                                    item.results.map((result, index) => (
                                                        <div key={`${item.id}-${result.to}-${index}`} className="flex items-center justify-between gap-3 rounded border bg-background px-2 py-1.5 text-xs">
                                                            <span className="truncate">{result.to}</span>
                                                            <span className={result.success ? "text-emerald-600" : "text-red-600"}>
                                                                {result.success ? "Đã gửi" : result.error || "Lỗi"}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-muted-foreground">Không có dữ liệu chi tiết người nhận.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
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