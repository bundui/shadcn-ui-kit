"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getUsers, createUser, updateUser, deleteUser } from "@/lib/services/user.service";
import { getRoles } from "@/lib/services/role.service";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconLoader2, IconLock, IconLockOpen, IconAlertTriangle } from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import UsersDataTable, { UserRow } from "./data-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown, ShieldAlert, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

const emptyForm = { full_name: "", email: "", password: "", role_id: "", is_locked: false };

export default function UsersClient() {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("search") || "";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = 10;

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]);

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Delete states
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Lock modal states
  const [lockTarget, setLockTarget] = useState<{ user: UserRow; action: "lock" | "unlock" } | null>(null);
  const [locking, setLocking] = useState(false);

  // Transfer Admin modal states
  const [transferAdminDialogOpen, setTransferAdminDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{ type: "update" | "delete", targetId: string, payload?: any } | null>(null);
  const [transferTargetId, setTransferTargetId] = useState<string>("");
  const [transferring, setTransferring] = useState(false);
  const [transferSearch, setTransferSearch] = useState("");
  const [transferUsers, setTransferUsers] = useState<UserRow[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) {
          setPage(1);
        }
        return search;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (page > 1) params.set("page", page.toString());
    
    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      router.replace(`${pathname}?${newQueryString}`, { scroll: false });
    }
  }, [debouncedSearch, page, pathname, router, searchParams]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const roleFilter = role === "staff" ? "customer" : undefined;
    const { data, totalPages: fetchedTotalPages } = await getUsers(debouncedSearch, page, pageSize, roleFilter);
    setUsers((data as any) ?? []);
    setTotalPages(fetchedTotalPages || 1);
    setLoading(false);
  }, [debouncedSearch, page, pageSize, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (!transferAdminDialogOpen) return;
    const fetchTransferCandidates = async () => {
      const { data } = await getUsers(transferSearch, 1, 10);
      if (data) {
        setTransferUsers(data.filter((u: any) => u.id !== pendingAction?.targetId));
      }
    };
    const timeout = setTimeout(fetchTransferCandidates, 300);
    return () => clearTimeout(timeout);
  }, [transferSearch, transferAdminDialogOpen, pendingAction?.targetId]);

  const executeTransferAndContinue = async () => {
    if (!transferTargetId || !pendingAction) return;
    setTransferring(true);
    try {
      const adminRole = roles.find(r => r.name === "admin");
      if (!adminRole) throw new Error("Admin role not found");

      // 1. Nâng cấp người được chọn lên Admin
      const { error: transferError } = await updateUser(transferTargetId, { role_id: adminRole.id });
      if (transferError) throw transferError;

      // 2. Tiếp tục hành động còn dang dở
      if (pendingAction.type === "update") {
        const { error: updateError } = await updateUser(pendingAction.targetId, pendingAction.payload);
        if (updateError) throw updateError;
      } else if (pendingAction.type === "delete") {
        const { error: deleteError } = await deleteUser(pendingAction.targetId);
        if (deleteError) throw deleteError;
      }

      setTransferAdminDialogOpen(false);
      setTransferTargetId("");
      setPendingAction(null);
      setDialogOpen(false);
      setDeleteTarget(null);
      setDeleteConfirmText("");
      fetchUsers();
    } catch (err: any) {
      alert("Lỗi khi chuyển quyền: " + (err.message || "Unknown error"));
    } finally {
      setTransferring(false);
    }
  };

  useEffect(() => {
    const loadRoles = async () => {
      const { data } = await getRoles();
      if (data) setRoles(data);
    };
    loadRoles();
  }, []);

  const openCreate = () => {
    setEditingUser(null);
    const defaultRoleId = role === "staff" 
      ? (roles.find(r => r.name === "customer")?.id || "") 
      : emptyForm.role_id;
    setForm({ ...emptyForm, role_id: defaultRoleId });
    setDialogOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setEditingUser(user);
    setForm({
      full_name: user.full_name || "",
      email: user.email || "",
      password: "", // cannot edit password here
      role_id: user.role?.id || "",
      is_locked: !!user.is_locked,
    });
    setDialogOpen(true);
  };

  const openDelete = (user: UserRow) => {
    setDeleteTarget(user);
    setDeleteConfirmText("");
  };

  const openToggleLock = (user: UserRow, newLockedStatus: boolean) => {
    if (role !== "admin" && role !== "staff") return;
    setLockTarget({ user, action: newLockedStatus ? "lock" : "unlock" });
  };

  const executeToggleLock = async () => {
    if (!lockTarget) return;
    setLocking(true);
    try {
      const { error } = await updateUser(lockTarget.user.id, { is_locked: lockTarget.action === "lock" });
      if (error) throw error;
      setLockTarget(null);
      fetchUsers();
    } catch (err: any) {
      alert("Lỗi cập nhật trạng thái: " + (err.message || "Unknown error"));
    } finally {
      setLocking(false);
    }
  };

  const handleSave = async () => {
    if (!form.full_name || !form.role_id) {
      alert("Vui lòng điền Tên hiển thị và Vai trò.");
      return;
    }

    if (!editingUser) {
      if (!form.email || !form.password) {
        alert("Vui lòng điền Email và Password khi tạo mới.");
        return;
      }
    }

    setSaving(true);
    try {
      if (editingUser) {
        const payload: any = {
          full_name: form.full_name,
          is_locked: form.is_locked,
        };
        if (role !== "staff") {
          payload.role_id = form.role_id;
        }
        const { error } = await updateUser(editingUser.id, payload);
        if (error) {
          if (error.message && error.message.includes("ít nhất 1 Admin")) {
            setPendingAction({ type: "update", targetId: editingUser.id, payload });
            setTransferAdminDialogOpen(true);
            return;
          }
          throw error;
        }
      } else {
        const payload: any = {
          email: form.email,
          password: form.password,
          full_name: form.full_name,
          role_id: role === "staff" ? (roles.find(r => r.name === "customer")?.id || form.role_id) : form.role_id,
          is_locked: form.is_locked,
        };
        const { error } = await createUser(payload);
        if (error) throw error;
      }
      setDialogOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || role !== "admin") return;
    setDeleting(true);
    try {
      const { error } = await deleteUser(deleteTarget.id);
      if (error) {
        if (error.message && error.message.includes("ít nhất 1 Admin")) {
          setPendingAction({ type: "delete", targetId: deleteTarget.id });
          setTransferAdminDialogOpen(true);
          return;
        }
        throw error;
      }
      setDeleteTarget(null);
      setDeleteConfirmText("");
      fetchUsers();
    } catch (err: any) {
      alert("Lỗi khi xóa tài khoản: " + (err.message || "Unknown error"));
    } finally {
      setDeleting(false);
    }
  };

  const isDeleteConfirmed = deleteTarget && (
    deleteConfirmText.trim().toUpperCase() === "XÓA TÀI KHOẢN" ||
    deleteConfirmText.trim() === deleteTarget.email
  );

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
            Quản lý Tài khoản
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Quản lý phân quyền và thông tin người dùng trong hệ thống
          </p>
        </div>
        <Button onClick={openCreate} className="relative z-10 gap-2 rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-11 w-full sm:w-auto mt-2 sm:mt-0">
          <PlusCircledIcon className="size-5" />
          <span className="font-semibold">Thêm người dùng</span>
        </Button>
      </div>

      <div className="w-full">
        <UsersDataTable 
          data={users}
          pageCount={totalPages}
          pageIndex={page - 1}
          pageSize={pageSize}
          onPageChange={(newIdx) => setPage(newIdx + 1)}
          search={search}
          onSearchChange={setSearch}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
          onToggleLock={openToggleLock}
          role={role}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__zoomIn">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingUser ? "Chỉnh sửa Tài khoản" : "Tạo Tài khoản mới"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingUser
                ? "Cập nhật thông tin của người dùng."
                : "Điền thông tin bên dưới để cấp tài khoản mới."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="font-semibold">Tên hiển thị <span className="text-red-500">*</span></Label>
              <Input
                id="full_name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Nhập họ và tên..."
                className="rounded-xl h-11 bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-semibold">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com"
                disabled={!!editingUser}
                className="rounded-xl h-11 bg-background/50"
              />
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password" className="font-semibold">Mật khẩu <span className="text-red-500">*</span></Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu..."
                  className="rounded-xl h-11 bg-background/50"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role" className="font-semibold">Vai trò <span className="text-red-500">*</span></Label>
              <Select
                value={form.role_id}
                onValueChange={(val) => setForm({ ...form, role_id: val })}
                disabled={role === "staff" || saving}
              >
                <SelectTrigger id="role" className="rounded-xl h-11 bg-background/50">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {roles
                    .filter(r => role === "admin" ? true : r.name === "customer")
                    .map(r => (
                      <SelectItem key={r.id} value={r.id} className="rounded-lg cursor-pointer">
                        <span className="capitalize">{r.name}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="space-y-1">
                <Label htmlFor="is_locked" className="text-base font-bold">Khóa tài khoản</Label>
                <p className="text-xs text-muted-foreground">Ngăn chặn người dùng đăng nhập vào hệ thống.</p>
              </div>
              <Switch
                id="is_locked"
                checked={form.is_locked}
                onCheckedChange={(checked) => setForm({ ...form, is_locked: checked })}
              />
            </div>
          </div>
          
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving} className="rounded-full px-6 bg-background/50 hover:bg-secondary">
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving} className="rounded-full px-8 shadow-md shadow-primary/20">
              {saving && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__bounceIn">
          <AlertDialogHeader className="relative z-10">
            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              <span className="bg-red-500/10 p-2 rounded-full text-red-500">
                <IconAlertTriangle className="size-5" />
              </span>
              Xác nhận xóa tài khoản vĩnh viễn
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2 text-foreground/80">
              <p>
                Bạn có chắc chắn muốn xóa tài khoản <strong>{deleteTarget?.email}</strong>? Hành động này <strong>không thể hoàn tác</strong> và sẽ xóa sạch toàn bộ hồ sơ, thông tin xác thực cùng các dữ liệu liên quan khỏi hệ thống.
              </p>
              <div className="bg-red-500/5 dark:bg-red-950/20 p-3.5 rounded-xl border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                Để xác nhận, vui lòng gõ chính xác cụm từ <strong>XÓA TÀI KHOẢN</strong> (hoặc email <strong>{deleteTarget?.email}</strong>) vào ô bên dưới:
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-2">
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Gõ XÓA TÀI KHOẢN hoặc email để xác nhận..."
              className="border-red-500/30 focus-visible:ring-red-500 rounded-xl h-11 bg-background/50"
              disabled={deleting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isDeleteConfirmed && !deleting) {
                  e.preventDefault();
                  handleDelete();
                }
              }}
            />
          </div>

          <AlertDialogFooter className="relative z-10 pt-2">
            <AlertDialogCancel disabled={deleting} className="rounded-full px-6 bg-background/50 hover:bg-secondary border-border/50">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "rounded-full px-6 transition-all",
                (!isDeleteConfirmed || deleting) ? "opacity-50 cursor-not-allowed pointer-events-none bg-red-600" : "bg-red-600 hover:bg-red-700 hover:scale-105 shadow-lg shadow-red-500/20 text-white"
              )}
              onClick={(e) => {
                e.preventDefault();
                if (isDeleteConfirmed && !deleting) {
                  handleDelete();
                }
              }}
              disabled={deleting || !isDeleteConfirmed}
            >
              {deleting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!lockTarget} onOpenChange={(open) => !open && !locking && setLockTarget(null)}>
        <AlertDialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__bounceIn">
          <AlertDialogHeader className="relative z-10">
            <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
              {lockTarget?.action === "lock" ? (
                <span className="bg-amber-500/10 p-2 rounded-full text-amber-500">
                  <IconLock className="size-5" />
                </span>
              ) : (
                <span className="bg-emerald-500/10 p-2 rounded-full text-emerald-500">
                  <IconLockOpen className="size-5" />
                </span>
              )}
              {lockTarget?.action === "lock" ? "Khóa quyền truy cập?" : "Mở khóa tài khoản?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2 text-foreground/80">
              {lockTarget?.action === "lock" ? (
                <>
                  <p>
                    Tài khoản <strong>{lockTarget.user.email}</strong> sẽ bị <strong>hủy phiên đăng nhập</strong> trên toàn bộ các thiết bị.
                  </p>
                  <div className="bg-amber-500/5 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-500/20 text-xs text-amber-700 dark:text-amber-400">
                    Người dùng sẽ không thể đăng nhập hoặc thực hiện bất kỳ giao dịch nào cho tới khi được Mở khóa.
                  </div>
                </>
              ) : (
                <>
                  <p>
                    Tài khoản <strong>{lockTarget?.user.email}</strong> sẽ được khôi phục toàn bộ quyền đăng nhập và mua sắm bình thường trên hệ thống.
                  </p>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="relative z-10 pt-2">
            <AlertDialogCancel disabled={locking} className="rounded-full px-6 bg-background/50 hover:bg-secondary border-border/50">Hủy</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "rounded-full px-6 transition-all text-white",
                lockTarget?.action === "lock"
                  ? "bg-amber-600 hover:bg-amber-700 hover:scale-105 shadow-lg shadow-amber-500/20"
                  : "bg-emerald-600 hover:bg-emerald-700 hover:scale-105 shadow-lg shadow-emerald-500/20"
              )}
              onClick={(e) => {
                e.preventDefault();
                executeToggleLock();
              }}
              disabled={locking}
            >
              {locking && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              {lockTarget?.action === "lock" ? "Xác nhận Khóa" : "Xác nhận Mở khóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Transfer Admin Dialog */}
      <AlertDialog open={transferAdminDialogOpen} onOpenChange={setTransferAdminDialogOpen}>
        <AlertDialogContent className="sm:max-w-md overflow-visible bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__bounceIn">
          <AlertDialogHeader className="relative z-10">
            <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400">
              <div className="bg-orange-500/10 p-2 rounded-full shrink-0">
                <Image src="/icons/warning1.png" alt="warning" width={30} height={30} className="w-7 h-7 object-contain" />
              </div>
              <AlertDialogTitle className="text-xl font-bold">
                Chuyển giao Quyền Quản Trị
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4 pt-3 text-foreground/80 text-sm">
              <p>
                Bạn đang thực hiện thao tác xóa hoặc hạ cấp tài khoản <strong>Admin duy nhất</strong> của hệ thống.
              </p>
              <div className="bg-orange-500/5 dark:bg-orange-950/20 p-4 rounded-xl border border-orange-500/20 text-xs text-orange-600 dark:text-orange-400 leading-relaxed shadow-inner">
                Để tiếp tục, vui lòng chọn một tài khoản khác để chuyển quyền Admin. Hệ thống không thể không có người quản trị.
              </div>
              <div className="flex flex-col gap-2 pt-2">
                <Label className="font-semibold text-foreground">Chọn Quản trị viên mới</Label>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={popoverOpen}
                      className="w-full justify-between h-11 rounded-xl bg-background/50 border-border/50 hover:bg-secondary transition-colors"
                    >
                      {transferTargetId
                        ? transferUsers.find((user) => user.id === transferTargetId)?.full_name || "Đã chọn 1 tài khoản"
                        : "Tìm kiếm người dùng (Tên/Email)..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[380px] p-0 rounded-[16px] border-border/50 shadow-xl overflow-hidden bg-card/95 backdrop-blur-xl" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput 
                        placeholder="Nhập tên hoặc email..." 
                        value={transferSearch}
                        onValueChange={setTransferSearch}
                        className="h-11"
                      />
                      <CommandList className="max-h-[220px] hide-scrollbar p-1">
                        <CommandEmpty className="py-6 text-center text-sm">Không tìm thấy tài khoản nào.</CommandEmpty>
                        <CommandGroup>
                          {transferUsers.map((user) => (
                            <CommandItem
                              key={user.id}
                              value={user.id}
                              onSelect={(currentValue) => {
                                setTransferTargetId(currentValue === transferTargetId ? "" : currentValue);
                                setPopoverOpen(false);
                              }}
                              className="rounded-xl my-1 cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary",
                                  transferTargetId === user.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 ring-1 ring-border/50 shadow-sm">
                                  <AvatarImage src={user.avatar_url || ""} />
                                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                    {user.full_name?.substring(0, 2).toUpperCase() || "U"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <span className="font-semibold text-sm">{user.full_name}</span>
                                  <span className="text-muted-foreground text-[11px] block truncate w-40">{user.email}</span>
                                </div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 relative z-10 pt-2 border-t border-border/50">
            <AlertDialogCancel disabled={transferring} className="rounded-full px-6 bg-background/50 hover:bg-secondary border-border/50" onClick={() => {
              setPendingAction(null);
              setTransferTargetId("");
            }}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              className={cn(
                "rounded-full px-6 transition-all text-white",
                !transferTargetId || transferring ? "opacity-50 cursor-not-allowed bg-orange-600" : "bg-orange-600 hover:bg-orange-700 hover:scale-105 shadow-lg shadow-orange-500/20"
              )}
              disabled={!transferTargetId || transferring}
              onClick={(e) => {
                e.preventDefault();
                executeTransferAndContinue();
              }}
            >
              {transferring && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Xác nhận Chuyển quyền & Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
