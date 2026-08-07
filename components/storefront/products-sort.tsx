"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { IconX } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
}

interface ProductsSortProps {
  categories: Category[];
}

export function ProductsSort({ categories }: ProductsSortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategories = searchParams.getAll("categories");
  const currentBrands = searchParams.getAll("brands");
  const currentSort = searchParams.get("sort") || "default";

  const createQueryString = useCallback(
    (name: string, value: string, action: "add" | "remove" | "set") => {
      const params = new URLSearchParams(searchParams.toString());

      if (action === "set") {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
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

  const removeCategory = (id: string) => {
    router.push(pathname + "?" + createQueryString("categories", id, "remove"));
  };

  const removeBrand = (brand: string) => {
    router.push(pathname + "?" + createQueryString("brands", brand, "remove"));
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("categories");
    params.delete("brands");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("page");
    router.push(pathname + "?" + params.toString());
  };

  const handleSortChange = (val: string) => {
    if (val === "default") {
      router.push(pathname + "?" + createQueryString("sort", "", "set"));
    } else {
      router.push(pathname + "?" + createQueryString("sort", val, "set"));
    }
  };

  const hasFilters = currentCategories.length > 0 || currentBrands.length > 0;

  return (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-card border rounded-2xl p-4 shadow-sm gap-4">
      {/* Active Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        {hasFilters && <span className="text-sm text-muted-foreground mr-1 hidden sm:inline-block">Đang lọc:</span>}
        
        {currentCategories.map((catId) => {
          const catName = categories.find((c) => c.id === catId)?.name || catId;
          return (
            <Badge
              key={`cat-${catId}`}
              variant="secondary"
              className="pl-3 pr-1.5 py-1 text-[13px] font-medium flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0"
            >
              {catName}
              <button
                onClick={() => removeCategory(catId)}
                className="hover:bg-primary/20 p-0.5 rounded-full transition-colors focus:outline-none"
              >
                <IconX className="h-3.5 w-3.5" />
              </button>
            </Badge>
          );
        })}

        {currentBrands.map((brand) => (
          <Badge
            key={`brand-${brand}`}
            variant="secondary"
            className="pl-3 pr-1.5 py-1 text-[13px] font-medium flex items-center gap-1.5 bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-0"
          >
            {brand}
            <button
              onClick={() => removeBrand(brand)}
              className="hover:bg-primary/20 p-0.5 rounded-full transition-colors focus:outline-none"
            >
              <IconX className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}

        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs h-7 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 ml-1 rounded-full px-3"
          >
            Xóa tất cả
          </Button>
        )}
      </div>

      {/* Sorting Dropdown */}
      <div className="flex items-center gap-3 ml-auto w-full sm:w-auto">
        <label htmlFor="sort" className="text-sm font-medium text-muted-foreground whitespace-nowrap">
          Sắp xếp theo:
        </label>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger className="w-full sm:w-[180px] h-9 rounded-full bg-background border-border/50 shadow-sm focus:ring-primary/20">
            <SelectValue placeholder="Mặc định" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-lg">
            <SelectItem value="default" className="rounded-lg cursor-pointer">
              Mặc định
            </SelectItem>
            <SelectItem value="price_asc" className="rounded-lg cursor-pointer">
              Giá: Từ thấp đến cao
            </SelectItem>
            <SelectItem value="price_desc" className="rounded-lg cursor-pointer">
              Giá: Từ cao đến thấp
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
