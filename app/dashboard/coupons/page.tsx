"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconLoader2,
} from "@tabler/icons-react";
import RoleGuard from "@/components/guards/role-guard";
import { 
  Coupon, 
  getCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon
} from "@/lib/services/coupon.service";

function CouponsContent() {
  const { role } = useAuth();
  const router = useRouter();

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    title: "",
    discount_percent: 0,
    valid_until: "",
    usage_limit: 0,
    is_active: true,
  });

  useEffect(() => {
    if (role && role !== "admin" && role !== "staff") {
      router.push("/dashboard");
    }
  }, [role, router]);

  useEffect(() => {
    async function fetchCoupons() {
      setLoading(true);
      const { data } = await getCoupons();
      if (data) {
        setCoupons(data);
      }
      setLoading(false);
    }
    fetchCoupons();
  }, [refreshTrigger]);

  const handleOpenCreateDialog = () => {
    setDialogMode("create");
    setFormData({
      code: "",
      title: "",
      discount_percent: 10,
      valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      usage_limit: 0,
      is_active: true,
    });
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (coupon: Coupon) => {
    setDialogMode("edit");
    setSelectedCoupon(coupon);
    setFormData({
      code: coupon.code,
      title: coupon.title || "",
      discount_percent: coupon.discount_percent,
      valid_until: new Date(coupon.valid_until).toISOString().slice(0, 16),
      usage_limit: coupon.usage_limit || 0,
      is_active: coupon.is_active,
    });
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.code.trim()) {
      setFormError("Vui lòng nhập mã giảm giá");
      return;
    }
    if (formData.discount_percent <= 0 || formData.discount_percent > 100) {
      setFormError("Phần trăm giảm phải từ 1 đến 100");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      ...formData,
      code: formData.code.toUpperCase().trim(),
      usage_limit: formData.usage_limit > 0 ? formData.usage_limit : undefined,
      valid_until: new Date(formData.valid_until).toISOString(),
    };

    if (dialogMode === "create") {
      const { error } = await createCoupon(payload);
      if (error) {
        setFormError(error.message || "Lỗi khi tạo mã");
      } else {
        setIsDialogOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    } else if (dialogMode === "edit" && selectedCoupon) {
      const { error } = await updateCoupon(selectedCoupon.id, payload);
      if (error) {
        setFormError(error.message || "Lỗi khi cập nhật mã");
      } else {
        setIsDialogOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    }

    setIsSubmitting(false);
  };

  const confirmDelete = async () => {
    if (!couponToDelete || role !== "admin") return;
    setIsSubmitting(true);
    const { error } = await deleteCoupon(couponToDelete);
    setIsSubmitting(false);
    if (error) {
      alert("Lỗi khi xóa: " + error.message);
    } else {
      setIsDeleteDialogOpen(false);
      setCouponToDelete(null);
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await updateCoupon(id, { is_active: !currentStatus });
    if (error) {
      alert("Lỗi khi cập nhật trạng thái");
    } else {
      setRefreshTrigger((prev) => prev + 1);
    }
  };

  if (role !== "admin" && role !== "staff") return null;

  return (
    <div className="p-4 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
            Mã giảm giá
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Quản lý toàn bộ mã giảm giá và chương trình ưu đãi của hệ thống</p>
        </div>
        <Button onClick={handleOpenCreateDialog} className="rounded-full shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold w-full sm:w-auto">
          <IconPlus className="w-4 h-4 " /> Thêm Mã mới
        </Button>
      </div>

      <div className="rounded-[24px] border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col w-full min-w-0">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[800px] w-full">
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="font-bold text-foreground h-14">Mã code</TableHead>
              <TableHead className="font-bold text-foreground h-14">Mô tả ngắn</TableHead>
              <TableHead className="font-bold text-foreground h-14">Giảm giá</TableHead>
              <TableHead className="font-bold text-foreground h-14">Đã dùng</TableHead>
              <TableHead className="font-bold text-foreground h-14">Hạn sử dụng</TableHead>
              <TableHead className="font-bold text-foreground h-14">Trạng thái</TableHead>
              <TableHead className="text-right font-bold text-foreground h-14">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <IconLoader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  Chưa có mã giảm giá nào.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-md inline-block mt-2.5 ml-2">
                    {coupon.code}
                  </TableCell>
                  <TableCell className="font-medium">{coupon.title || "-"}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/5 text-primary ">
                      {coupon.discount_percent}%
                    </span>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    <span className="text-foreground">{coupon.used_count}</span> / {coupon.usage_limit || "∞"}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-medium text-sm">
                    {new Date(coupon.valid_until).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={coupon.is_active}
                      onCheckedChange={() => handleToggleActive(coupon.id, coupon.is_active)}
                      className={coupon.is_active ? "data-[state=checked]:bg-emerald-500" : ""}
                    />
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenEditDialog(coupon)}
                      className="rounded-full hover:bg-blue-500/10 hover:text-blue-600 text-muted-foreground transition-colors"
                    >
                      <IconEdit className="w-4 h-4" />
                    </Button>
                    {role === "admin" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCouponToDelete(coupon.id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="rounded-full hover:bg-red-500/10 hover:text-red-600 text-muted-foreground transition-colors ml-1"
                      >
                        <IconTrash className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[24px] border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6 animate__animated animate__zoomIn">
          <DialogHeader className="pr-8 text-left">
            <DialogTitle className="text-xl md:text-2xl font-extrabold text-foreground">
              {dialogMode === "create" ? "Thêm mã giảm giá mới" : "Chỉnh sửa mã giảm giá"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-2 ">
            {formError && (
              <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-200 dark:border-red-900/50">
                {formError}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mã code</Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="VD: WELCOME20"
                  className="uppercase font-mono"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Phần trăm giảm (%)</Label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.discount_percent}
                  onChange={(e) => setFormData({ ...formData, discount_percent: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mô tả ngắn / Tiêu đề</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="VD: Mã giảm 20% cho đơn hàng đầu tiên"
              />
              <p className="text-xs text-gray-500">Ghi chú hoặc giải thích điều kiện áp dụng cho mã giảm giá.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hạn sử dụng</Label>
                <Input
                  type="datetime-local"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Giới hạn lượt dùng</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: parseInt(e.target.value) || 0 })}
                />
                <p className="text-xs text-gray-500">Để 0 là không giới hạn</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Switch
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                className="data-[state=checked]:bg-emerald-500"
              />
              <Label className="font-medium text-muted-foreground">Kích hoạt (Cho phép sử dụng)</Label>
            </div>

            <DialogFooter className="pt-4 border-t border-border/50 mt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
                className="rounded-full font-medium"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                {isSubmitting && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
                Lưu mã giảm giá
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      {role === "admin" && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-[24px] border-red-500/20 bg-card/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6 w-[calc(100%-2rem)] sm:max-w-lg animate__animated animate__bounceIn">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-red-600 dark:text-red-400 font-extrabold text-xl">Xác nhận xóa Mã giảm giá?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Mã giảm giá sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className=" border-t border-border/50 pt-4">
              <AlertDialogCancel disabled={isSubmitting} className="rounded-full font-medium border-0 hover:bg-muted/50">Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  confirmDelete();
                }}
                className="rounded-full bg-red-600 hover:bg-red-700 text-white font-bold"
                disabled={isSubmitting}
              >
                {isSubmitting && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
                Xác nhận xóa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default function CouponsPage() {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]}>
      <CouponsContent />
    </RoleGuard>
  );
}
