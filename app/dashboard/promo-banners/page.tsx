"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RoleGuard from "@/components/guards/role-guard";
import { useAuth } from "@/components/providers/auth-provider";
import {
  PromoBanner,
  getPromoBannersAdmin,
  createPromoBanner,
  updatePromoBanner,
  deletePromoBanner,
  updatePromoBannerOrders,
} from "@/lib/services/banner.service";
import { uploadImage } from "@/lib/services/storage.service";
import { getCategories, createCategory } from "@/lib/services/category.service";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  IconSearch,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";

interface SortableRowProps {
  banner: PromoBanner;
  handleToggleActive: (banner: PromoBanner, checked: boolean) => void;
  handleOpenEdit: (banner: PromoBanner) => void;
  setBannerToDelete: (id: string) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
  role: string | null;
}

function SortableBannerRow({
  banner,
  handleToggleActive,
  handleOpenEdit,
  setBannerToDelete,
  setIsDeleteDialogOpen,
  role,
}: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: banner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? "bg-muted/80 shadow-lg relative" : ""} border-border/50 hover:bg-muted/30 transition-colors`}
    >
      <TableCell className="w-10 text-center p-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
        >
          <IconGripVertical className="size-5" />
        </button>
      </TableCell>
      <TableCell>
        <div className="w-16 h-10 rounded overflow-hidden bg-secondary border shrink-0 relative">
          <Image fill unoptimized src={banner.image_url} alt={banner.title} className="object-cover" />
        </div>
      </TableCell>
      <TableCell className="font-medium">
        <div>{banner.title}</div>
        {banner.subtitle && <div className="text-xs text-muted-foreground">{banner.subtitle}</div>}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
        {banner.link_url || "-"}
      </TableCell>
      <TableCell className="text-center font-medium">
        {banner.order_index}
      </TableCell>
      <TableCell className="text-center" onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={banner.is_active}
          onCheckedChange={(checked) => handleToggleActive(banner, checked)}
          className={banner.is_active ? "data-[state=checked]:bg-emerald-500" : ""}
        />
      </TableCell>
      <TableCell className="text-right whitespace-nowrap">
        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleOpenEdit(banner)}
            className="rounded-full h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-500/10 transition-colors"
          >
            <IconEdit className="w-4 h-4" />
            <span className="sr-only">Sửa</span>
          </Button>
          {role === "admin" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setBannerToDelete(banner.id);
                setIsDeleteDialogOpen(true);
              }}
              className="rounded-full h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-500/10 transition-colors"
            >
              <IconTrash className="w-4 h-4" />
              <span className="sr-only">Xóa</span>
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function PromoBannersPageContent() {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [banners, setBanners] = useState<PromoBanner[]>([]);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
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

  const fetchBanners = useCallback(async () => {
    setLoading(true);
    const [bannersData, categoriesData] = await Promise.all([
      getPromoBannersAdmin(debouncedSearch, page, pageSize),
      getCategories("", 1, 100)
    ]);

    if (bannersData.data) {
      setBanners(bannersData.data);
      setTotalPages(bannersData.totalPages || 1);
    }

    if (categoriesData.data) {
      setCategories(categoriesData.data);
    }
    setLoading(false);
  }, [debouncedSearch, page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchBanners();
  }, [fetchBanners, refreshTrigger]);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedBanner, setSelectedBanner] = useState<PromoBanner | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image_url: "",
    link_url: "",
    badge_text: "",
    badge_color: "primary",
    order_index: 0,
    is_active: true,
  });
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [linkType, setLinkType] = useState<"category" | "custom">("custom");

  // Category Combobox state
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [debouncedCatSearch, setDebouncedCatSearch] = useState("");
  const [isSearchingCat, setIsSearchingCat] = useState(false);

  // Quick Create Category state
  const [quickCreateDialogOpen, setQuickCreateDialogOpen] = useState(false);
  const [quickCreateName, setQuickCreateName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Debounce category search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCatSearch(catSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [catSearch]);

  // Fetch categories when combobox is open or search changes
  useEffect(() => {
    const fetchCats = async () => {
      setIsSearchingCat(true);
      const { data } = await getCategories(debouncedCatSearch, 1, 100);
      if (data) setCategories(data);
      setIsSearchingCat(false);
    };
    if (comboboxOpen) {
      fetchCats();
    }
  }, [debouncedCatSearch, comboboxOpen]);

  // Delete Alert States
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = banners.findIndex((b) => b.id === active.id);
    const newIndex = banners.findIndex((b) => b.id === over.id);

    const reordered = arrayMove(banners, oldIndex, newIndex);
    const updatedBanners = reordered.map((b, idx) => ({ ...b, order_index: idx }));
    setBanners(updatedBanners);

    try {
      const payload = updatedBanners.map((b) => ({ id: b.id, order_index: b.order_index }));
      await updatePromoBannerOrders(payload);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenCreate = () => {
    setDialogMode("create");
    setSelectedBanner(null);
    const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => Number(b.order_index) || 0)) : 0;
    const nextOrder = maxOrder + 1;
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image_url: "",
      link_url: "",
      badge_text: "",
      badge_color: "primary",
      order_index: nextOrder,
      is_active: true,
    });
    setFormError("");
    setLinkType("custom");
    setCatSearch("");
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (banner: PromoBanner) => {
    setDialogMode("edit");
    setSelectedBanner(banner);

    // Determine link type based on existing link_url
    let currentLinkType: "category" | "custom" = "custom";
    if (banner.link_url && banner.link_url.startsWith("/products?categories=")) {
      currentLinkType = "category";
    }

    setLinkType(currentLinkType);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      description: banner.description || "",
      image_url: banner.image_url,
      link_url: banner.link_url || "",
      badge_text: banner.badge_text || "",
      badge_color: banner.badge_color || "primary",
      order_index: banner.order_index,
      is_active: banner.is_active ?? true,
    });
    setFormError("");
    setIsDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError("");

    const { url, error } = await uploadImage(file, "banners");

    if (error) {
      setFormError("Lỗi khi tải ảnh lên: " + (error.message || "Unknown error"));
    } else if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
    }

    setIsUploading(false);
  };

  const handleToggleActive = async (banner: PromoBanner, checked: boolean) => {
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: checked } : b));
    const { error } = await updatePromoBanner(banner.id, { is_active: checked });
    if (error) {
      setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, is_active: !checked } : b));
      toast.error(error.message || "Không thể cập nhật trạng thái banner");
    } else {
      toast.success(checked ? "Đã bật hiển thị banner" : "Đã tắt hiển thị banner");
      router.refresh();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Vui lòng nhập tiêu đề");
      return;
    }
    if (!formData.image_url.trim()) {
      setFormError("Vui lòng nhập đường dẫn hình ảnh");
      return;
    }

    setIsSubmitting(true);

    let finalOrderIndex = Number(formData.order_index) || 0;
    const maxOrder = banners.length > 0 ? Math.max(...banners.map(b => Number(b.order_index) || 0)) : 0;

    if (dialogMode === "create") {
      if (finalOrderIndex <= 0 || banners.some(b => b.order_index === finalOrderIndex)) {
        finalOrderIndex = maxOrder + 1;
      }
      const { error } = await createPromoBanner({ ...formData, order_index: finalOrderIndex });
      if (error) {
        setFormError(error.message || "Lỗi khi tạo banner");
      } else {
        toast.success("Đã tạo banner mới thành công");
        setIsDialogOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    } else if (dialogMode === "edit" && selectedBanner) {
      if (banners.some(b => b.id !== selectedBanner.id && b.order_index === finalOrderIndex)) {
        finalOrderIndex = maxOrder + 1;
      }
      const { error } = await updatePromoBanner(selectedBanner.id, { ...formData, order_index: finalOrderIndex });
      if (error) {
        setFormError(error.message || "Lỗi khi cập nhật banner");
      } else {
        toast.success("Đã cập nhật banner thành công");
        setIsDialogOpen(false);
        setRefreshTrigger((prev) => prev + 1);
      }
    }

    setIsSubmitting(false);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete || role !== "admin") return;
    setIsSubmitting(true);
    const { error } = await deletePromoBanner(bannerToDelete);
    setIsSubmitting(false);

    if (!error) {
      setIsDeleteDialogOpen(false);

      // Cập nhật lại số thứ tự (order_index) tuần tự cho các banner còn lại sau khi xóa
      const remaining = banners
        .filter(b => b.id !== bannerToDelete)
        .sort((a, b) => a.order_index - b.order_index)
        .map((b, idx) => ({ ...b, order_index: idx }));

      if (remaining.length > 0) {
        try {
          await updatePromoBannerOrders(remaining.map(b => ({ id: b.id, order_index: b.order_index })));
        } catch (err) {
          console.error("Error re-indexing remaining banners:", err);
        }
      }

      toast.success("Đã xóa banner và cập nhật lại số thứ tự");
      setBannerToDelete(null);
      // Fetch data again
      if (banners.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        setRefreshTrigger(prev => prev + 1);
      }
    } else {
      console.error("Delete failed:", error);
      toast.error(error.message || "Xóa thất bại!");
    }
  };

  const handleQuickCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCreateName.trim()) return;

    setCreatingCategory(true);
    const { data, error } = await createCategory({
      name: quickCreateName.trim(),
    });
    setCreatingCategory(false);

    if (error) {
      alert("Lỗi khi tạo danh mục: " + error.message);
    } else if (data) {
      // Add to local state
      setCategories((prev) => [data, ...prev]);
      // Select it
      setFormData((prev) => ({ ...prev, link_url: `/products?categories=${data.id}` }));
      setComboboxOpen(false);
      setQuickCreateDialogOpen(false);
      setQuickCreateName("");
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 lg:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">Quản lý Promo Banner</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Tạo và quản lý các banner hiển thị ngoài trang chủ (kéo thả để đổi thứ tự).
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="rounded-full shadow-emerald-500/20 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center w-full sm:w-auto mt-2 sm:mt-0">
          <IconPlus className="w-4 h-4 " />
          Thêm Banner
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-[24px] border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm p-4">
        <div className="relative w-full md:w-96">
          <Image src="/icons/search.png" alt="Search" width={20} height={20} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Tìm kiếm banner..."
            className="pl-9 w-full rounded-full bg-background/50 border-border/50 focus-visible:ring-emerald-500/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-[24px] border border-border/50 bg-card/50 backdrop-blur-xl shadow-sm overflow-hidden flex flex-col w-full min-w-0">
        <div className="overflow-x-auto w-full">
          <Table className="min-w-[800px] w-full">
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-12 text-center h-14"></TableHead>
                <TableHead className="w-24 font-bold text-foreground h-14">Hình ảnh</TableHead>
                <TableHead className="font-bold text-foreground h-14">Tiêu đề</TableHead>
                <TableHead className="font-bold text-foreground h-14">Link đích</TableHead>
                <TableHead className="w-24 text-center font-bold text-foreground h-14">Thứ tự</TableHead>
                <TableHead className="w-24 text-center font-bold text-foreground h-14">Hiển thị</TableHead>
                <TableHead className="w-[120px] text-right font-bold text-foreground h-14">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <IconLoader2 className="w-8 h-8 animate-spin mb-2" />
                      <p>Đang tải dữ liệu...</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : banners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
                      <p>Không tìm thấy banner nào.</p>
                      {debouncedSearch && (
                        <Button
                          variant="link"
                          onClick={() => setSearch("")}
                          className="mt-2"
                        >
                          Xóa tìm kiếm
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={banners.map((b) => b.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {banners.map((banner) => (
                      <SortableBannerRow
                        key={banner.id}
                        banner={banner}
                        handleToggleActive={handleToggleActive}
                        handleOpenEdit={handleOpenEdit}
                        setBannerToDelete={setBannerToDelete}
                        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                        role={role}
                      />
                    ))}
                  </SortableContext>
                </DndContext>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t">
            <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 w-full sm:w-auto text-center">
              Trang <span className="text-foreground font-bold">{page}</span> / {totalPages}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Trước
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  // Simple logic to show pages around current page
                  let pageNum = page - 2 + i;
                  if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;

                  if (pageNum > 0 && pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden rounded-[24px] border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl p-0 flex flex-col animate__animated animate__zoomIn">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <form onSubmit={handleSubmit}>
            <DialogHeader className="pr-8 text-left">
              <DialogTitle className="text-xl md:text-2xl font-extrabold text-foreground">
                {dialogMode === "create" ? "Thêm Banner mới" : "Cập nhật Banner"}
              </DialogTitle>
              <DialogDescription>
                Điền thông tin chi tiết cho banner hiển thị ngoài trang chủ.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề chính *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="VD: Giảm đến 40%"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Tiêu đề phụ</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="VD: Tuần lễ công nghệ"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="badge_text">Chữ trên Nhãn (Badge)</Label>
                  <Input
                    id="badge_text"
                    value={formData.badge_text}
                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                    placeholder="VD: Hot, Mới"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả chi tiết</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Nhập mô tả ngắn gọn..."
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image_url">Hình ảnh Banner *</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="image_file"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                    className="flex-1"
                  />
                  {isUploading && <IconLoader2 className="w-5 h-5 animate-spin text-primary" />}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-[1px] flex-1 bg-border"></div>
                  <span className="text-xs text-muted-foreground uppercase">Hoặc dán Link</span>
                  <div className="h-[1px] flex-1 bg-border"></div>
                </div>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  required
                />
                {formData.image_url && (
                  <div className="mt-2 w-full h-32 rounded border bg-secondary overflow-hidden relative">
                    <Image fill unoptimized src={formData.image_url} alt="Preview" className="object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex gap-4 items-center mb-1">
                  <Label>Link đích khi click</Label>
                  <div className="flex gap-4 ml-auto">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="linkType"
                        value="category"
                        checked={linkType === "category"}
                        onChange={() => setLinkType("category")}
                      /> Danh mục
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="radio"
                        name="linkType"
                        value="custom"
                        checked={linkType === "custom"}
                        onChange={() => setLinkType("custom")}
                      /> Tùy chỉnh
                    </label>
                  </div>
                </div>

                {linkType === "category" ? (
                  <Popover open={comboboxOpen} onOpenChange={setComboboxOpen} modal={true}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={comboboxOpen}
                        className="w-full justify-between"
                      >
                        {formData.link_url && formData.link_url.startsWith("/products?categories=")
                          ? categories.find((c) => c.id === formData.link_url.replace("/products?categories=", ""))?.name || "Chọn danh mục"
                          : "Chọn danh mục"}
                        <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Tìm kiếm danh mục..."
                          value={catSearch}
                          onValueChange={setCatSearch}
                        />
                        <CommandList className="max-h-48">
                          {isSearchingCat ? (
                            <div className="p-4 text-center text-sm text-muted-foreground flex justify-center items-center">
                              <IconLoader2 className="mr-2 size-4 animate-spin" /> Đang tìm...
                            </div>
                          ) : (
                            <CommandEmpty className="p-2 text-sm text-muted-foreground text-center">
                              Không tìm thấy Danh mục.
                            </CommandEmpty>
                          )}
                          <CommandGroup>
                            {categories.map((c) => (
                              <CommandItem
                                key={c.id}
                                value={c.id}
                                onSelect={() => {
                                  setFormData((prev) => ({ ...prev, link_url: `/products?categories=${c.id}` }));
                                  setComboboxOpen(false);
                                }}
                              >
                                <IconCheck
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    formData.link_url === `/products?categories=${c.id}` ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                        <div className="border-t p-1">
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-primary"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setQuickCreateName(catSearch);
                              setQuickCreateDialogOpen(true);
                            }}
                          >
                            <IconPlus className="mr-2 size-4" />
                            Tạo mới {catSearch ? `"${catSearch}"` : "danh mục"}
                          </Button>
                        </div>
                      </Command>
                    </PopoverContent>
                  </Popover>
                ) : (
                  <Input
                    id="link_url"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="VD: https://... hoặc /products"
                  />
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="order_index">Thứ tự ưu tiên</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(c) => setFormData({ ...formData, is_active: c })}
                  className="data-[state=checked]:bg-emerald-500"
                />
                <Label htmlFor="is_active" className="font-medium text-muted-foreground">Hiển thị trên trang chủ</Label>
              </div>

              {formError && (
                <div className="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                  {formError}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t border-border/50 mt-4">
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
                {dialogMode === "create" ? "Tạo mới" : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      {role === "admin" && (
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="rounded-[24px] border-red-500/20 bg-card/95 backdrop-blur-xl shadow-2xl p-4 sm:p-6 w-[calc(100%-2rem)] sm:max-w-lg animate__animated animate__bounceIn">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-red-600 dark:text-red-400 font-extrabold text-xl">Xác nhận xóa Banner?</AlertDialogTitle>
              <AlertDialogDescription>
                Hành động này không thể hoàn tác. Banner sẽ bị xóa vĩnh viễn khỏi hệ thống.
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
      {/* Quick Create Category Dialog */}
      <Dialog open={quickCreateDialogOpen} onOpenChange={setQuickCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-[24px] border-border/50 bg-card/95 backdrop-blur-xl shadow-2xl animate__animated animate__bounceIn" style={{ zIndex: 10000 }}>
          <form onSubmit={handleQuickCreateCategory}>
            <DialogHeader>
              <DialogTitle className="text-xl font-extrabold text-foreground">Thêm nhanh Danh mục</DialogTitle>
              <DialogDescription>
                Tạo một danh mục mới để liên kết ngay lập tức.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="quick-cat-name">Tên danh mục *</Label>
                <Input
                  id="quick-cat-name"
                  value={quickCreateName}
                  onChange={(e) => setQuickCreateName(e.target.value)}
                  placeholder="VD: Điện thoại di động"
                  required
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="pt-4 border-t border-border/50 mt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setQuickCreateDialogOpen(false)}
                disabled={creatingCategory}
                className="rounded-full font-medium"
              >
                Hủy
              </Button>
              <Button type="submit" disabled={creatingCategory} className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                {creatingCategory && <IconLoader2 className="w-4 h-4 mr-2 animate-spin" />}
                Tạo nhanh
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PromoBannersPage() {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]}>
      <Suspense fallback={
        <div className="flex items-center justify-center h-[60vh]">
          <IconLoader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }>
        <PromoBannersPageContent />
      </Suspense>
    </RoleGuard>
  );
}
