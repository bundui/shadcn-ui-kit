import { getAllCategories } from "@/lib/services/category.service";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Layers, ArrowUpRight } from "lucide-react";

export async function CategoriesSection() {
  const { data: categories } = await getAllCategories();

  if (!categories || categories.length === 0) return null;

  // Tải danh sách ảnh sản phẩm mới nhất để làm ảnh đại diện động cho từng danh mục
  const { data: products } = await supabase
    .from("products")
    .select("id, name, image_url, category_id")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false });

  return (
    <section className="py-20 bg-background relative overflow-hidden border-b border-border/40">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 flex items-center gap-1.5">
              <Sparkles className="size-3.5 fill-primary text-primary" /> Bộ sưu tập theo chủ đề
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              Khám Phá Theo Danh Mục
            </h2>
          </div>
          <Link 
            href="/products" 
            className="group inline-flex items-center gap-2 text-sm font-semibold text-foreground bg-card/80 backdrop-blur-md border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm shrink-0"
          >
            Tất cả danh mục <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((category) => {
            // Lọc ra tối đa 3 sản phẩm thuộc danh mục này có ảnh
            const catProducts = products?.filter(p => p.category_id === category.id).slice(0, 3) || [];
            const productCount = products?.filter(p => p.category_id === category.id).length || 0;

            return (
              <Link 
                key={category.id} 
                href={`/products?categories=${category.id}`}
                className="group relative flex flex-col justify-between p-5 bg-card/80 backdrop-blur-xl hover:bg-card/90 rounded-[32px] border border-border/50 hover:border-primary/40 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* Khu vực Hình ảnh đại diện động (Product Collage Preview) */}
                <div className="relative h-44 w-full rounded-[24px] bg-muted/20 mb-5 flex items-center justify-center overflow-hidden p-3 border border-border/50 group-hover:border-primary/30 transition-colors">
                  {catProducts.length >= 2 ? (
                    <div className="relative size-full flex items-center justify-center">
                      {/* Ảnh sau lệch trái */}
                      <Image 
                        width={112}
                        height={112}
                        unoptimized
                        src={catProducts[1].image_url} 
                        alt={catProducts[1].name}
                        className="absolute size-28 object-contain p-1.5 bg-secondary/30 rounded-xl shadow-md -rotate-12 -translate-x-4 opacity-70 group-hover:-rotate-16 group-hover:-translate-x-6 transition-all duration-500 border border-background" 
                      />
                      {/* Ảnh trước chính giữa */}
                      <Image 
                        width={128}
                        height={128}
                        unoptimized
                        src={catProducts[0].image_url} 
                        alt={catProducts[0].name}
                        className="absolute size-32 object-contain p-2 bg-secondary/30 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 z-10 border-2 border-background" 
                      />
                    </div>
                  ) : catProducts.length === 1 ? (
                    <Image 
                      width={144}
                      height={144}
                      unoptimized
                      src={catProducts[0].image_url} 
                      alt={catProducts[0].name}
                      className="size-36 object-contain p-2 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-muted-foreground/60">
                      <Layers className="size-10 stroke-1 mb-1 animate-pulse" />
                      <span className="text-[10px] font-medium">Đang cập nhật </span>
                    </div>
                  )}

                  {/* Icon mũi tên góc phải */}
                  <div className="absolute top-2.5 right-2.5 size-7 rounded-full bg-background/90 backdrop-blur shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0 text-primary">
                    <ArrowUpRight className="size-3.5" />
                  </div>
                </div>

                {/* Thông tin danh mục */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors truncate">
                      {category.name}
                    </h3>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="line-clamp-1 opacity-90">
                      {category.description || "Khám phá ngay"}
                    </span>
                    <span className="font-semibold text-primary/80 bg-primary/10 px-2 py-0.5 rounded-full text-[10px] shrink-0">
                      {productCount > 0 ? `${productCount} ` : "Mới"}
                    </span>
                  </div>
                </div>

                {/* Bottom gradient bar hover effect */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary via-amber-500 to-primary w-0 group-hover:w-full transition-all duration-500" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}


