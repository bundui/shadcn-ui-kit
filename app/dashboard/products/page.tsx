"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RoleGuard from "@/components/guards/role-guard";
import { useAuth } from "@/components/providers/auth-provider";
import {
  getProduct,
  deleteProduct,
} from "@/lib/services/product.service";
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
import { ProductForm } from "@/components/admin/product-form";
import { ProductCard } from "@/components/storefront/product-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Badge } from "@/components/ui/badge";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconPackage,
  IconSearch,
  IconLoader2,
  IconX,
} from "@tabler/icons-react";
import { supabase } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  category_id?: string | null;
  categories?: { name: string } | null;
  discount_percent?: number | null;
  stock_quantity?: number | null;
  description_html?: string | null;
  brand?: string | null;
  created_at: string;
  updated_at: string;
};


function ProductsPageContent() {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Pagination state
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const [page, setPage] = useState(initialPage);
  const pageSize = 8; // 4 columns grid
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
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProducts = useCallback(async () => {
    setTimeout(() => setLoading(true), 0);
    const { data, error, totalPages: fetchedTotalPages } = await getProduct(debouncedSearch, page, pageSize);
    if (error) console.error(error);
    setProducts(data ?? []);
    if (fetchedTotalPages !== undefined) {
      setTotalPages(fetchedTotalPages || 1);
    }
    setLoading(false);
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts, refreshTrigger]);



  useEffect(() => {

    const channel = supabase
      .channel("products-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        setRefreshTrigger((prev) => prev + 1);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Open dialog for create
  const openCreate = () => {
    setEditingProduct(null);
    setDialogOpen(true);
  };

  // Open dialog for edit
  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setDialogOpen(true);
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const { error } = await deleteProduct(deleteTarget.id);
    if (error) alert(error.message);
    setDeleting(false);
    setDeleteTarget(null);
    fetchProducts();
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-700 slide-in-from-bottom-4">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">
            Quản lý sản phẩm
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Quản lý danh mục sản phẩm của bạn
          </p>
        </div>
        {role === "admin" && (
          <Button 
            onClick={openCreate} 
            className="relative z-10 gap-2 rounded-full px-6 shadow-lg shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-500 text-white border-0 transition-all duration-300 hover:scale-105 w-full sm:w-auto mt-2 sm:mt-0"
          >
            <IconPlus className="size-4" />
            Thêm sản phẩm
          </Button>
        )}
      </div>

      {/* Search & Stats */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-1">
        <div className="relative max-w-sm w-full group">
          <Image src="/icons/search.png" alt="search" width={20} height={20} className="text-muted-foreground z-10 absolute left-4 top-1/2 size-4 -translate-y-1/2 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-full bg-card/50 backdrop-blur-sm border-border/50 focus-visible:ring-primary/20 h-11 shadow-md"
          />
        </div>
        <Badge variant="secondary" className="w-full sm:w-auto justify-center gap-1.5 px-4 py-2 rounded-full bg-primary/5 shadow-sm text-primary hover:bg-primary/20 border-0 font-bold transition-colors">
          <Image src="/icons/cart-history.png" alt="product" width={20} height={20}  />
          {products.length} sản phẩm
        </Badge>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <IconLoader2 className="text-primary size-10 animate-spin relative z-10" />
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-card/30 rounded-[32px] border border-border/50 border-dashed relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="bg-primary/10 mb-6 rounded-full p-6 relative">
             <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <IconPackage className="text-primary size-12 relative z-10" />
          </div>
          <h3 className="text-foreground text-xl font-bold mb-2">
            {search ? "Không tìm thấy sản phẩm nào" : "Chưa có sản phẩm nào"}
          </h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            {search
              ? "Vui lòng thử lại với từ khóa khác để tìm kiếm sản phẩm."
              : "Bắt đầu bằng cách thêm sản phẩm đầu tiên vào cửa hàng của bạn."}
          </p>
          {!search && role === "admin" && (
            <Button
              onClick={openCreate}
              className="mt-8 gap-2 rounded-full px-8 h-12 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300"
            >
              <IconPlus className="size-5" />
              Thêm sản phẩm ngay
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="relative group/admin block h-full">
              <ProductCard product={product} />
              
              {/* Admin actions overlay */}
              {(role === "admin" || role === "staff") && (
                <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-100 lg:opacity-0 lg:group-hover/admin:opacity-100 transition-opacity duration-300 z-50">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-9 w-9 shadow-lg rounded-full bg-background/80 backdrop-blur-md border border-border/50 text-foreground hover:bg-background hover:scale-110 transition-all"
                    onClick={(e) => { e.preventDefault(); openEdit(product); }}
                    title={role === "staff" ? "Cập nhật" : "Sửa sản phẩm"}
                  >
                    <IconEdit className="size-4" />
                  </Button>
                  {role === "admin" && (
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-9 w-9 shadow-lg rounded-full backdrop-blur-md hover:scale-110 transition-all"
                      onClick={(e) => { e.preventDefault(); setDeleteTarget(product); }}
                      title="Xóa sản phẩm"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {products.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2">
          <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full w-full sm:w-auto text-center border border-border/50">
            Trang <span className="text-foreground font-bold">{page}</span> / {totalPages}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="rounded-full px-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:shadow-none disabled:opacity-40 disabled:bg-muted/50"
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0 || loading}
              className="rounded-full px-5 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors shadow-md disabled:shadow-none disabled:opacity-40 disabled:bg-muted/50"
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {(role === "admin" || role === "staff") && (
        <ProductForm 
          open={dialogOpen} 
          onOpenChange={setDialogOpen} 
          product={editingProduct} 
          onSuccess={fetchProducts} 
        />
      )}

      {role === "admin" && (
        <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
          <AlertDialogContent className="bg-card/90 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] overflow-hidden animate__animated animate__bounceIn">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-500/10 rounded-full blur-[40px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <AlertDialogHeader className="relative z-10">
              <AlertDialogTitle className="text-xl font-bold flex items-center gap-2 text-foreground">
                <span className="bg-red-500/10 p-2 rounded-full text-red-500">
                  <Image src="/icons/delete.png" alt="delete" width={20} height={20} />
                </span>
                Bạn có chắc chắn muốn xóa?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-base mt-2">
                Hành động này không thể hoàn tác. Sản phẩm
                &quot;<span className="font-bold text-foreground">{deleteTarget?.name}</span>&quot; sẽ bị xóa vĩnh viễn khỏi hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="relative z-10 mt-4">
              <AlertDialogCancel disabled={deleting} className="rounded-full px-6 bg-secondary/50 border-0 hover:bg-secondary">Hủy</AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete();
                }}
                disabled={deleting}
                className="bg-red-600 text-white hover:bg-red-700 rounded-full px-6 shadow-lg shadow-red-600/20 transition-all"
              >
                {deleting ? (
                  <>
                    <IconLoader2 className="mr-2 size-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa sản phẩm"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]}>
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <IconLoader2 className="text-muted-foreground size-8 animate-spin" />
        </div>
      }>
        <ProductsPageContent />
      </Suspense>
    </RoleGuard>
  );
}
