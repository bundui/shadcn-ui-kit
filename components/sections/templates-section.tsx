import { Product, products, ProductTypeEnum } from "@/lib/products";
import { Badge } from "@/components/ui/badge";
import TemplateListItem from "@/app/(landing)/free-templates/list-item";
import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

export default function TemplatesSection() {
  const filteredProducts = products
    .sort((a, b) => b.id - a.id)
    .filter(
      (e) =>
        e.type.key === ProductTypeEnum.Template &&
        e.price !== "0" &&
        e.inTemplates,
    )
    .slice(0, 3);

  return (
    <section>
      <div className="container border-x px-0">
        <header className="mx-auto max-w-5xl space-y-3 py-8 text-center lg:py-16">
          <Badge variant="outline">Modern Website & App Templates</Badge>
          <h2 className="font-heading text-2xl font-semibold text-balance lg:text-4xl/tight">
            Premium Shadcn UI Templates
          </h2>
          <p className="text-muted-foreground text-balance md:text-lg/relaxed">
            A collection of modern, responsive website templates designed for
            real-world projects. Built with Next.js, Astro, Tailwind CSS, and
            shadcn/ui for fast development and easy customization.
          </p>
          <div className="flex justify-center gap-2 lg:mt-6">
            <Button asChild>
              <Link href="/templates">
                Explore All Templates <ExternalLinkIcon />
              </Link>
            </Button>
          </div>
        </header>
        <div className="divide-y border-t">
          {filteredProducts.length && (
            <>
              {filteredProducts.map((product: Product) => (
                <TemplateListItem
                  key={product.id}
                  template={product}
                  headingLevel="h3"
                />
              ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
