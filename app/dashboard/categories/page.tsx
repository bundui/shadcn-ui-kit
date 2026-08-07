"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RoleGuard from "@/components/guards/role-guard";
import { useAuth } from "@/components/providers/auth-provider";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/category.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconLoader2,
  IconTags,
  IconSearch,
} from "@tabler/icons-react";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";

type Category = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

function CategoriesPageContent() {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(initialPage);
  const pageSize = 10;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) {
          setPage(1); // Reset to page 1 on new search
        }
        return search;
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Sync state to URL
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

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    const { data, error, totalPages: fetchedTotalPages } = await getCategories(debouncedSearch, page, pageSize);
    if (error) console.error(error);
    setCategories(data ?? []);
    if (fetchedTotalPages !== undefined) {
      setTotalPages(fetchedTotalPages || 1);
    }
    setLoading(false);
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshTrigger]);

  useEffect(() => {
    const channel = supabase
      .channel("categories-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "categories" },
        () => {
          setRefreshTrigger((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Open dialog for create
  const openCreate = () => {
    setEditingCategory(null);
    setName("");
    setErrorMsg("");
    setDialogOpen(true);
  };

  // Open dialog for edit
  const openEdit = (category: Category) => {
    setEditingCategory(category);
    setName(category.name);
    setErrorMsg("");
    setDialogOpen(true);
  };

  // Submit create/update
  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg("Vui lòng nhập tên danh mục");
      return;
    }
    if (!editingCategory && role !== "admin") return;
    setSaving(true);
    setErrorMsg("");

    try {
      const payload = {
        name: name.trim(),
      };

      if (editingCategory) {
        const { error } = await updateCategory(editingCategory.id, payload);
        if (error) {
          if (error.code === '23505') {
            setErrorMsg("Tên danh mục đã tồn tại");
          } else {
            setErrorMsg(error.message);
          }
          return;
        }
      } else {
        const { error } = await createCategory(payload);
        if (error) {
          if (error.code === '23505') {
            setErrorMsg("Tên danh mục đã tồn tại");
          } else {
            setErrorMsg(error.message);
          }
          return;
        }
      }
      setDialogOpen(false);
      fetchCategories();
    } catch (err: any) {
      setErrorMsg(err.message || "Đã xảy ra lỗi");
    } finally {
      setSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteCategory(deleteTarget.id);
    if (error) alert(error.message);
    setDeleting(false);
    setDeleteTarget(null);
    fetchCategories();
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
            Quản lý Danh mục
          </h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Quản lý và phân loại các danh mục sản phẩm của hệ thống
          </p>
        </div>
        {role === "admin" && (
          <Button onClick={openCreate} className="relative z-10 gap-2 rounded-full px-6 shadow-lg shadow-primary/20 hover:scale-105 transition-transform h-11 w-full sm:w-auto mt-2 sm:mt-0">
            <IconPlus className="size-5" />
            <span className="font-semibold">Thêm Danh mục</span>
          </Button>
        )}
      </div>

      <div className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-sm rounded-[24px] overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Search */}
          <div className="flex items-center">
            <div className="relative max-w-sm w-full group">
              <Image src="/icons/search.png" alt="Search" width={20} height={20} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-full h-11 bg-background/50 border-border/50 hover:bg-secondary transition-colors focus-visible:ring-primary/30 shadow-md"
              />
            </div>
          </div>

          {/* Categories Table */}
          <div className="rounded-[16px] border border-border/50 overflow-hidden shadow-sm bg-background/30 flex flex-col">
            <div className="overflow-x-auto">
              <Table className="min-w-[500px]">
                <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/50">
                  <TableHead className="font-bold text-foreground h-12">Tên danh mục</TableHead>
                  <TableHead className="font-bold text-foreground h-12">Ngày tạo</TableHead>
                  <TableHead className="font-bold text-foreground h-12 text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center">
                      <div className="flex items-center justify-center">
                        <IconLoader2 className="text-muted-foreground size-8 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <IconTags className="mb-2 size-8" />
                        <p>Chưa có danh mục nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  categories.map((category) => (
                    <TableRow key={category.id} className="group/row transition-colors hover:bg-muted/50 border-border/50">
                      <TableCell className="font-medium text-foreground">{category.name}</TableCell>
                      <TableCell>{formatDate(category.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(category)}
                            className="rounded-full h-8 w-8 hover:bg-secondary transition-colors"
                          >
                            <IconEdit className="size-4 text-blue-500" />
                          </Button>
                          {role === "admin" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => setDeleteTarget(category)}
                              className="rounded-full h-8 w-8 hover:bg-red-500/10 transition-colors"
                            >
                              <IconTrash className="size-4 text-red-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pt-6 pb-2">
              <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 w-full sm:w-auto text-center">
                Trang <span className="text-foreground font-bold">{page}</span> / {totalPages || 1}
              </div>
              <div className="flex items-center space-x-2 w-full sm:w-auto justify-center sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className="rounded-full px-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40 disabled:bg-muted/50"
                >
                  Trước
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0 || loading}
                  className="rounded-full px-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors disabled:opacity-40 disabled:bg-muted/50"
                >
                  Sau
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__zoomIn">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {editingCategory ? "Chỉnh sửa Danh mục" : "Thêm Danh mục mới"}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {editingCategory
                ? "Cập nhật thông tin danh mục dưới đây."
                : "Nhập tên cho danh mục sản phẩm mới."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="category-name" className="font-semibold">Tên danh mục <span className="text-red-500">*</span></Label>
              <Input
                id="category-name"
                placeholder="Ví dụ: Điện thoại, Laptop..."
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errorMsg) setErrorMsg("");
                }}
                className="rounded-xl h-11 bg-background/50"
              />
              {errorMsg && (
                <p className="text-sm text-red-500 mt-1 font-medium">{errorMsg}</p>
              )}
            </div>
          </div>

          <DialogFooter className="pt-2">
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              className="rounded-full px-6 bg-background/50 hover:bg-secondary border-border/50"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !name.trim()}
              className="rounded-full px-8 shadow-md shadow-primary/20 hover:scale-105 transition-transform"
            >
              {saving && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              {saving
                ? "Đang lưu..."
                : editingCategory
                  ? "Lưu thay đổi"
                  : "Tạo Danh mục"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {role === "admin" && (
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => !open && setDeleteTarget(null)}
        >
          <AlertDialogContent className="sm:max-w-md bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__bounceIn">
            <AlertDialogHeader className="relative z-10">
              <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                <span className="bg-red-500/10 p-2 rounded-full text-red-500">
                  <IconTrash className="size-5" />
                </span>
                Xác nhận xóa danh mục
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-3 pt-2 text-foreground/80">
                <p>
                  Bạn có chắc chắn muốn xóa danh mục{" "}
                  <strong className="text-foreground">&ldquo;{deleteTarget?.name}&rdquo;</strong>?
                </p>
                <div className="bg-red-500/5 p-3.5 rounded-xl border border-red-500/20 text-xs text-red-600 dark:text-red-400">
                  Hành động này không thể hoàn tác. Các sản phẩm thuộc danh mục này có thể sẽ bị ảnh hưởng (mất phân loại).
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="relative z-10 pt-2">
              <AlertDialogCancel disabled={deleting} className="rounded-full px-6 bg-background/50 hover:bg-secondary border-border/50">Hủy bỏ</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 hover:scale-105 text-white shadow-lg shadow-red-500/20 transition-all rounded-full px-6"
              >
                {deleting && <IconLoader2 className="mr-2 size-4 animate-spin" />}
                Xóa vĩnh viễn
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <IconLoader2 className="text-muted-foreground size-8 animate-spin" />
      </div>
    }>
      <RoleGuard allowedRoles={["admin", "staff"]}>
        <CategoriesPageContent />
      </RoleGuard>
    </Suspense>
  );
}
