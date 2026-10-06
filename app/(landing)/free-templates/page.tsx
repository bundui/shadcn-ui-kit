import { generateMeta } from "@/lib/metadata";
import TemplateListItem from "./list-item";
import { Product, products, ProductTypeEnum } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateMeta({
  title: "Free Templates for Shadcn UI",
  description:
    "Open source website templates built with Next.js, React, Astro, Tailwind CSS. Includes Typescript and is compatible with shadcn/ui.",
});

export default function Page() {
  const filteredProducts = products
    .sort((a, b) => b.id - a.id)
    .filter(
      (e) =>
        e.type.key === ProductTypeEnum.Template &&
        e.price === "0" &&
        e.inTemplates,
    );

  return (
    <section>
      <div className="container border-x px-0">
        <header className="mx-auto max-w-5xl space-y-3 py-8 text-center lg:py-10">
          <h1 className="text-3xl lg:text-5xl font-heading font-semibold">Free Shadcn UI Templates</h1>
          <p className="text-muted-foreground text-balance md:text-lg/relaxed">
            Open source website templates built with Next.js, React, Astro,
            Tailwind CSS. Includes Typescript and is compatible with shadcn/ui.
          </p>
          <div className="mt-5">
            <Button variant="outline" asChild>
              <Link href="/templates">
                Premium Templates <ChevronRight />
              </Link>
            </Button>
          </div>
        </header>
        <div className="divide-y border-t">
          {filteredProducts.length && (
            <>
              {filteredProducts.map((template: Product) => (
                <TemplateListItem key={template.id} template={template} />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
