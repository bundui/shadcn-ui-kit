"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { IconFilter } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
}

interface ProductsFilterProps {
  categories: Category[];
  brands: string[];
}

export function ProductsFilter({ categories, brands }: ProductsFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Local state for instant UI update
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");

  // Read current filters from URL
  const currentCategories = searchParams.getAll("categories");
  const currentBrands = searchParams.getAll("brands");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  useEffect(() => {
    queueMicrotask(() => {
      setMinPriceInput(minPrice);
      setMaxPriceInput(maxPrice);
    });
  }, [minPrice, maxPrice]);

  const createQueryString = useCallback(
    (name: string, value: string, action: "add" | "remove" | "set") => {
      const params = new URLSearchParams(searchParams.toString());
      
      // Reset page to 1 when filter changes
      params.delete("page");

      if (action === "set") {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      } else if (action === "add") {
        params.append(name, value);
      } else if (action === "remove") {
        const values = params.getAll(name);
        params.delete(name);
        values.forEach((v) => {
          if (v !== value) params.append(name, v);
        });
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleCategory = (id: string) => {
    const action = currentCategories.includes(id) ? "remove" : "add";
    router.push(pathname + "?" + createQueryString("categories", id, action));
  };

  const toggleBrand = (brand: string) => {
    const action = currentBrands.includes(brand) ? "remove" : "add";
    router.push(pathname + "?" + createQueryString("brands", brand, action));
  };

  const applyPriceInputs = () => {
    let qs = new URLSearchParams(searchParams.toString());
    qs.delete("page");
    
    if (minPriceInput) qs.set("minPrice", minPriceInput);
    else qs.delete("minPrice");

    if (maxPriceInput) qs.set("maxPrice", maxPriceInput);
    else qs.delete("maxPrice");

    router.push(pathname + "?" + qs.toString());
  };

  const formatCurrency = (val: string) => {
    if (!val) return "";
    const num = parseInt(val.replace(/\D/g, ""));
    if (isNaN(num)) return "";
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const parseCurrency = (val: string) => {
    return val.replace(/\D/g, "");
  };

  const filterContent = (
    <Accordion type="multiple" defaultValue={["categories", "brands", "price"]} className="w-full">
      {categories.length > 0 && (
        <AccordionItem value="categories" className="border-b-0 mb-2">
          <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Danh mục
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={currentCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                      className="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all"
                    />
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-primary transition-colors">
                      {category.name}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      )}

      {brands.length > 0 && (
        <AccordionItem value="brands" className="border-b-0 mb-2">
          <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
            Thương hiệu
          </AccordionTrigger>
          <AccordionContent className="pt-2 pb-4">
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => {
                const isSelected = currentBrands.includes(brand);
                return (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:text-foreground hover:border-border/50"
                    )}
                  >
                    {brand}
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}

      <AccordionItem value="price" className="border-b-0">
        <AccordionTrigger className="hover:no-underline py-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Khoảng giá
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-2">
          <div className="space-y-6">
            <div className="px-2">
              <Slider
                min={0}
                max={100000000}
                step={500000}
                value={[Number(minPriceInput || 0), Number(maxPriceInput || 100000000)]}
                onValueChange={(vals) => {
                  setMinPriceInput(vals[0] > 0 ? vals[0].toString() : "");
                  setMaxPriceInput(vals[1] < 100000000 ? vals[1].toString() : "");
                }}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Từ</span>
                <input
                  type="text"
                  value={formatCurrency(minPriceInput)}
                  onChange={(e) => setMinPriceInput(parseCurrency(e.target.value))}
                  onKeyDown={(e) => e.key === 'Enter' && applyPriceInputs()}
                  className="w-full h-9 rounded-md border border-input bg-transparent pl-7 pr-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="0 đ"
                />
              </div>
              <span className="text-muted-foreground text-sm">-</span>
              <div className="relative w-full">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-medium">Đến</span>
                <input
                  type="text"
                  value={formatCurrency(maxPriceInput)}
                  onChange={(e) => setMaxPriceInput(parseCurrency(e.target.value))}
                  onKeyDown={(e) => e.key === 'Enter' && applyPriceInputs()}
                  className="w-full h-9 rounded-md border border-input bg-transparent pl-9 pr-2 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  placeholder="Max"
                />
              </div>
            </div>
            <Button onClick={applyPriceInputs} className="w-full shadow-sm" size="sm">
              Áp dụng giá
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden w-full flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Sản phẩm</h1>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 h-10 px-4 rounded-full shadow-sm">
              <IconFilter className="h-4 w-4" />
              Bộ lọc
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:max-w-md flex flex-col p-0">
            <SheetHeader className="p-6 pb-4 border-b text-left">
              <SheetTitle className="text-xl">Bộ lọc sản phẩm</SheetTitle>
              <SheetDescription>
                Tùy chỉnh để tìm sản phẩm phù hợp nhất.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 px-6 py-2 min-h-0">
              {filterContent}
            </ScrollArea>
            <div className="p-4 border-t bg-background ">
              <Button className=" w-full h-11 rounded-full text-base font-medium shadow-sm" onClick={() => setIsMobileOpen(false)}>
                Xem kết quả
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block lg:col-span-3 space-y-6 h-fit sticky top-[100px]">
        <div className="mb-2 text-center">
          <h1 className="text-4xl font-extrabold text-foreground mb-2 tracking-tight">Sản phẩm</h1>
          <p className="text-muted-foreground text-sm">Khám phá bộ sưu tập đẳng cấp</p>
        </div>
        <div className="bg-card border rounded-2xl p-5 shadow-[0_2px_20px_rgba(0,0,0,0.04)]">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
