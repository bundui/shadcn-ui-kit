"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  createProduct,
  updateProduct,
  addProductImages,
  deleteProductImage,
  syncProductVariants,
  syncProductSpecs,
  getProductById,
} from "@/lib/services/product.service";
import { getCategories, createCategory } from "@/lib/services/category.service";
import { uploadProductImage, uploadProductImages } from "@/lib/services/storage.service";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
  IconLoader2,
  IconUpload,
  IconX,
  IconCheck,
  IconChevronDown,
  IconPlus,
} from "@tabler/icons-react";

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
  product_images?: { id: string; image_url: string; display_order: number }[];
  product_variants?: { id: string; name: string; sku: string; price_modifier: number; stock_quantity: number }[];
  product_specs?: { id: string; spec_name: string; spec_value: string }[];
};

type GalleryImage = {
  id?: string;
  url: string;
  file?: File;
  isExisting: boolean;
};

type VariantState = {
  id?: string;
  name: string;
  sku: string;
  price_modifier: string;
  stock_quantity: string;
};

type SpecState = {
  id?: string;
  spec_name: string;
  spec_value: string;
};

type FormState = {
  name: string;
  price: string;
  category_id: string;
  discount_percent: string;
  stock_quantity: string;
  brand: string;
  description_html: string;
  imageFile: File | null;
  imagePreview: string;
  galleryImages: GalleryImage[];
  imagesToDelete: string[];
  variants: VariantState[];
  specs: SpecState[];
};

const emptyForm: FormState = {
  name: "",
  price: "",
  category_id: "",
  discount_percent: "0",
  stock_quantity: "0",
  brand: "",
  description_html: "",
  imageFile: null,
  imagePreview: "",
  galleryImages: [],
  imagesToDelete: [],
  variants: [],
  specs: [],
};

interface ProductFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSuccess: () => void;
}

export function ProductForm({ open, onOpenChange, product, onSuccess }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Category Combobox state
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [catSearch, setCatSearch] = useState("");
  const [debouncedCatSearch, setDebouncedCatSearch] = useState("");
  const [isSearchingCat, setIsSearchingCat] = useState(false);
  
  // Quick Create Category state
  const [quickCreateDialogOpen, setQuickCreateDialogOpen] = useState(false);
  const [quickCreateName, setQuickCreateName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  // State for loading full details
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Sync state when dialog opens
  useEffect(() => {
    const loadDetails = async () => {
      if (!open) return;

      if (product) {
        setLoadingDetails(true);
        // Fetch full product to get relations (variants, specs, images)
        const { data: fullProduct } = await getProductById(product.id);
        const p = fullProduct || product;

        const existingGallery: GalleryImage[] = p.product_images?.map((img: any) => ({
          id: img.id,
          url: img.image_url,
          isExisting: true,
        })) || [];
        
        setForm({
          name: p.name,
          price: String(p.price),
          category_id: p.category_id ?? "",
          discount_percent: String(p.discount_percent ?? 0),
          stock_quantity: String(p.stock_quantity ?? 0),
          brand: p.brand ?? "",
          description_html: p.description_html ?? "",
          imageFile: null,
          imagePreview: p.image_url ?? "",
          galleryImages: existingGallery,
          imagesToDelete: [],
          variants: p.product_variants?.map((v: any) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price_modifier: String(v.price_modifier),
            stock_quantity: String(v.stock_quantity),
          })) || [],
          specs: p.product_specs?.map((s: any) => ({
            id: s.id,
            spec_name: s.spec_name,
            spec_value: s.spec_value,
          })) || [],
        });
        setLoadingDetails(false);
      } else {
        setForm(emptyForm);
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    };

    loadDetails();
  }, [open, product]);

  // Sync catSearch to debouncedCatSearch
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedCatSearch(catSearch), 500);
    return () => clearTimeout(timer);
  }, [catSearch]);

  // Fetch categories based on debounced search
  useEffect(() => {
    const loadCategories = async () => {
      setIsSearchingCat(true);
      const { data } = await getCategories(debouncedCatSearch, 1, 100);
      if (data) setCategories(data);
      setIsSearchingCat(false);
    };
    if (open) {
      loadCategories();
    }
  }, [debouncedCatSearch, open]);

  const handleQuickCreateCategory = async () => {
    if (!quickCreateName.trim()) return;
    setCreatingCategory(true);
    const { error } = await createCategory({ name: quickCreateName.trim() });
    setCreatingCategory(false);
    
    if (error) {
      alert(error.message);
      return;
    }

    setQuickCreateDialogOpen(false);
    
    // Refresh list and auto-select
    const { data } = await getCategories("", 1, 100);
    if (data) {
      setCategories(data);
      const newCat = data.find(c => c.name.toLowerCase() === quickCreateName.trim().toLowerCase());
      if (newCat) {
        setForm(f => ({ ...f, category_id: newCat.id }));
      }
    }
    setQuickCreateName("");
    setComboboxOpen(false);
  };

  // File selection handler
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, imageFile: file, imagePreview: preview }));
  };

  const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newGalleryImages: GalleryImage[] = files.map(file => ({
      url: URL.createObjectURL(file),
      file,
      isExisting: false,
    }));

    setForm(f => ({
      ...f,
      galleryImages: [...f.galleryImages, ...newGalleryImages]
    }));
  };

  const removeGalleryImage = (index: number) => {
    setForm(f => {
      const img = f.galleryImages[index];
      const newImagesToDelete = img.isExisting && img.id ? [...f.imagesToDelete, img.id] : f.imagesToDelete;
      
      const newGallery = [...f.galleryImages];
      newGallery.splice(index, 1);
      
      return {
        ...f,
        galleryImages: newGallery,
        imagesToDelete: newImagesToDelete
      };
    });
  };

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { name: "", sku: "", price_modifier: "0", stock_quantity: "0" }] }));
  const updateVariant = (index: number, field: keyof VariantState, value: string) => setForm(f => {
    const newVariants = [...f.variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    return { ...f, variants: newVariants };
  });
  const removeVariant = (index: number) => setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== index) }));

  const addSpec = () => setForm(f => ({ ...f, specs: [...f.specs, { spec_name: "", spec_value: "" }] }));
  const updateSpec = (index: number, field: keyof SpecState, value: string) => setForm(f => {
    const newSpecs = [...f.specs];
    newSpecs[index] = { ...newSpecs[index], [field]: value };
    return { ...f, specs: newSpecs };
  });
  const removeSpec = (index: number) => setForm(f => ({ ...f, specs: f.specs.filter((_, i) => i !== index) }));

  const clearImage = () => {
    setForm((f) => ({ ...f, imageFile: null, imagePreview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Submit create/update
  const handleSubmit = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);

    try {
      let imageUrl = product?.image_url;
      if (form.imageFile) {
        imageUrl = await uploadProductImage(form.imageFile);
      }

      const payload = {
        name: form.name.trim(),
        price: parseFloat(form.price),
        image_url: imageUrl,
        category_id: form.category_id || null,
        discount_percent: form.discount_percent ? parseInt(form.discount_percent) : 0,
        stock_quantity: form.stock_quantity ? parseInt(form.stock_quantity) : 0,
        brand: form.brand.trim() || null,
        description_html: form.description_html.trim() || null,
      };

      let productId = product?.id;

      if (product) {
        const { error } = await updateProduct(product.id, payload);
        if (error) throw error;
      } else {
        const { data: newProduct, error } = await createProduct(payload);
        if (error) throw error;
        productId = newProduct.id;
      }

      // Handle Gallery Images
      if (productId) {
        // Delete removed images
        for (const imgId of form.imagesToDelete) {
          await deleteProductImage(imgId);
        }

        // Upload new images
        const newFiles = form.galleryImages.filter(img => !img.isExisting && img.file).map(img => img.file!);
        if (newFiles.length > 0) {
          const uploadedUrls = await uploadProductImages(newFiles);
          await addProductImages(productId, uploadedUrls);
        }

        // Sync Variants
        const variantsPayload = form.variants.map(v => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          price_modifier: v.price_modifier ? parseFloat(v.price_modifier) : 0,
          stock_quantity: v.stock_quantity ? parseInt(v.stock_quantity) : 0,
        }));
        const { error: variantError } = await syncProductVariants(productId, variantsPayload);
        if (variantError) throw variantError;

        // Sync Specs
        const specsPayload = form.specs.map(s => ({
          id: s.id,
          spec_name: s.spec_name,
          spec_value: s.spec_value,
        }));
        const { error: specError } = await syncProductSpecs(productId, specsPayload);
        if (specError) throw specError;
      }

      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[32px] p-6 sm:p-8 animate__animated animate__zoomIn">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
          <DialogHeader className="relative z-10 mb-2">
            <DialogTitle className="text-2xl font-bold text-foreground">
              {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}
            </DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              {product
                ? "Chỉnh sửa các thông tin chi tiết của sản phẩm dưới đây."
                : "Điền đầy đủ thông tin để thêm một sản phẩm mới vào cửa hàng."}
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex h-64 items-center justify-center relative z-10">
              <IconLoader2 className="text-primary size-8 animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 py-2 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product-name" className="text-sm font-semibold">Tên sản phẩm <span className="text-red-500">*</span></Label>
                <Input
                  id="product-name"
                  placeholder="VD: Tai nghe Bluetooth Sony..."
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-price" className="text-sm font-semibold">Giá bán (VNĐ) <span className="text-red-500">*</span></Label>
                <Input
                  id="product-price"
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="VD: 1500000"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="product-category" className="text-sm font-semibold">Danh mục</Label>
                <Popover open={comboboxOpen} onOpenChange={setComboboxOpen} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      id="product-category"
                      variant="outline"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      className="w-full justify-between rounded-xl bg-background/50 border-border/50 hover:bg-background/80 h-11 font-normal"
                    >
                      {form.category_id
                        ? categories.find((c) => c.id === form.category_id)?.name || "Chọn danh mục..."
                        : "Chọn danh mục..."}
                      <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[--radix-popover-trigger-width] p-0 rounded-xl overflow-hidden" align="start">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Tìm danh mục..."
                        value={catSearch}
                        onValueChange={setCatSearch}
                        className="h-11"
                      />
                      <CommandList className="max-h-48">
                        {isSearchingCat ? (
                          <div className="p-4 text-center text-sm text-muted-foreground flex justify-center items-center">
                            <IconLoader2 className="mr-2 size-4 animate-spin" /> Đang tìm...
                          </div>
                        ) : (
                          <CommandEmpty className="p-2 text-sm text-muted-foreground text-center">
                            Không tìm thấy danh mục.
                          </CommandEmpty>
                        )}
                        <CommandGroup>
                          {categories.map((c) => (
                            <CommandItem
                              key={c.id}
                              value={c.id}
                              onSelect={() => {
                                setForm((f) => ({ ...f, category_id: c.id }));
                                setComboboxOpen(false);
                              }}
                              className="rounded-lg m-1 cursor-pointer"
                            >
                              <IconCheck
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary",
                                  form.category_id === c.id ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {c.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                      <div className="border-t p-1 bg-muted/30">
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-primary rounded-lg hover:bg-primary/10 hover:text-primary"
                          onClick={() => {
                            setQuickCreateName(catSearch);
                            setQuickCreateDialogOpen(true);
                          }}
                        >
                          <IconPlus className="mr-2 size-4" />
                          Tạo {catSearch ? `"${catSearch}"` : "danh mục mới"}
                        </Button>
                      </div>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-brand" className="text-sm font-semibold">Thương hiệu</Label>
                <Input
                  id="product-brand"
                  placeholder="VD: Apple, Nike..."
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                  className="rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="product-discount" className="text-sm font-semibold">Giảm giá (%)</Label>
                <Input
                  id="product-discount"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="0"
                  value={form.discount_percent}
                  onChange={(e) => setForm((f) => ({ ...f, discount_percent: e.target.value }))}
                  className="rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-stock" className="text-sm font-semibold">Tồn kho</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.stock_quantity}
                  onChange={(e) => setForm((f) => ({ ...f, stock_quantity: e.target.value }))}
                  className="rounded-xl bg-background/50 border-border/50 focus-visible:ring-primary/30 h-11"
                />
              </div>
            </div>

            {/* Description HTML */}
            <div className="space-y-2 flex flex-col">
              <Label htmlFor="product-desc" className="text-sm font-semibold">Mô tả chi tiết</Label>
              <div className="rounded-xl overflow-hidden border border-border/50 bg-background/50">
                <RichTextEditor
                  value={form.description_html}
                  onChange={(html) => setForm((f) => ({ ...f, description_html: html }))}
                  placeholder="Nhập mô tả chi tiết sản phẩm tại đây..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main Image Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Ảnh đại diện chính</Label>
                {form.imagePreview ? (
                  <div className="relative overflow-hidden rounded-xl border border-border/50 h-48 group">
                    <Image
                      fill
                      unoptimized
                      src={form.imagePreview}
                      alt="Preview"
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute right-2 top-2 size-8 rounded-full p-0 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={clearImage}
                    >
                      <IconX className="size-4" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100"
                    >
                      <span className="rounded-lg bg-white/95 px-4 py-2 text-sm font-bold text-gray-900 shadow-md">
                        Đổi ảnh khác
                      </span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border-border hover:border-primary hover:bg-primary/5 flex w-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed h-48 transition-all bg-background/50 group"
                  >
                    <div className="bg-primary/10 rounded-full p-4 group-hover:scale-110 transition-transform">
                      <IconUpload className="text-primary size-6" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">Nhấn để tải ảnh lên</p>
                      <p className="text-muted-foreground mt-1 text-xs">PNG, JPG, WebP (Tối đa 5MB)</p>
                    </div>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </div>

              {/* Gallery Images Upload */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Thư viện ảnh</Label>
                <div className="grid grid-cols-3 gap-3 h-48 overflow-y-auto pr-2 hide-scrollbar">
                  {form.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-border/50 group shadow-sm">
                      <Image fill unoptimized src={img.url} className="object-cover" alt={`Gallery ${idx}`} />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute right-1.5 top-1.5 size-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        onClick={() => removeGalleryImage(idx)}
                      >
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                  <label className="border-border hover:border-primary hover:bg-primary/5 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all bg-background/50 group">
                    <IconPlus className="text-muted-foreground group-hover:text-primary size-6 mb-1 transition-colors group-hover:scale-110" />
                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-primary uppercase tracking-wider transition-colors">Thêm ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGallerySelect}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Variants Section */}
            <div className="space-y-4 border-t border-border/50 pt-6">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold text-foreground">Tùy chọn (Biến thể)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addVariant} className="h-9 gap-1.5 rounded-full px-4 border-primary/20 text-primary hover:bg-primary/10">
                  <IconPlus className="size-4" /> Thêm tùy chọn
                </Button>
              </div>
              {form.variants.length > 0 ? (
                <div className="grid gap-3">
                  {form.variants.map((v, i) => (
                    <div key={i} className="flex gap-2 items-start bg-card/50 p-3 rounded-xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                        <Input placeholder="Tên (VD: Màu Đỏ)" value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} className="rounded-lg bg-background/50 h-10" />
                        <Input placeholder="SKU" value={v.sku} onChange={(e) => updateVariant(i, "sku", e.target.value)} className="rounded-lg bg-background/50 h-10" />
                        <Input placeholder="Giá cộng thêm (VD: 50000)" type="number" value={v.price_modifier} onChange={(e) => updateVariant(i, "price_modifier", e.target.value)} className="rounded-lg bg-background/50 h-10" />
                        <Input placeholder="Tồn kho" type="number" min="0" value={v.stock_quantity} onChange={(e) => updateVariant(i, "stock_quantity", e.target.value)} className="rounded-lg bg-background/50 h-10" />
                      </div>
                      <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-lg shadow-sm" onClick={() => removeVariant(i)}>
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 bg-card/30 rounded-xl border border-border/50 border-dashed">Sản phẩm này không có biến thể.</p>
              )}
            </div>

            {/* Specifications Section */}
            <div className="space-y-4 border-t border-border/50 pt-6">
              <div className="flex items-center justify-between">
                <Label className="text-base font-bold text-foreground">Thông số kỹ thuật</Label>
                <Button type="button" variant="outline" size="sm" onClick={addSpec} className="h-9 gap-1.5 rounded-full px-4 border-primary/20 text-primary hover:bg-primary/10">
                  <IconPlus className="size-4" /> Thêm thông số
                </Button>
              </div>
              {form.specs.length > 0 ? (
                <div className="grid gap-3">
                  {form.specs.map((s, i) => (
                    <div key={i} className="flex gap-2 items-start bg-card/50 p-3 rounded-xl border border-border/50 shadow-sm transition-all hover:shadow-md">
                      <div className="grid grid-cols-2 gap-3 flex-1">
                        <Input placeholder="Tên thông số (VD: Chipset)" value={s.spec_name} onChange={(e) => updateSpec(i, "spec_name", e.target.value)} className="rounded-lg bg-background/50 h-10" />
                        <Input placeholder="Giá trị (VD: Apple M3)" value={s.spec_value} onChange={(e) => updateSpec(i, "spec_value", e.target.value)} className="rounded-lg bg-background/50 h-10" />
                      </div>
                      <Button type="button" variant="destructive" size="icon" className="shrink-0 rounded-lg shadow-sm" onClick={() => removeSpec(i)}>
                        <IconX className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6 bg-card/30 rounded-xl border border-border/50 border-dashed">Chưa có thông số kỹ thuật.</p>
              )}
            </div>
          </div>
          )}

          <DialogFooter className="relative z-10 pt-4 border-t border-border/50">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving} className="rounded-full px-6 bg-background/50 hover:bg-secondary">
              Hủy bỏ
            </Button>
            <Button onClick={handleSubmit} disabled={saving || !form.name.trim() || !form.price} className="gap-2 rounded-full px-8 shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
              {saving && <IconLoader2 className="size-4 animate-spin" />}
              {saving ? "Đang xử lý..." : product ? "Lưu thay đổi" : "Tạo sản phẩm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={quickCreateDialogOpen} onOpenChange={setQuickCreateDialogOpen}>
        <DialogContent className="sm:max-w-sm bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] animate__animated animate__zoomIn">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Tạo danh mục mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="quick-cat-name" className="font-semibold">Tên danh mục</Label>
              <Input
                id="quick-cat-name"
                placeholder="Nhập tên danh mục..."
                value={quickCreateName}
                onChange={(e) => setQuickCreateName(e.target.value)}
                autoFocus
                className="rounded-xl h-11 bg-background/50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuickCreateDialogOpen(false)} disabled={creatingCategory} className="rounded-full px-6">
              Hủy
            </Button>
            <Button onClick={handleQuickCreateCategory} disabled={!quickCreateName.trim() || creatingCategory} className="rounded-full px-6 shadow-md shadow-primary/20">
              {creatingCategory && <IconLoader2 className="mr-2 size-4 animate-spin" />}
              Lưu danh mục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
