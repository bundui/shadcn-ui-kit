import { generateMeta } from "@/lib/metadata";
import { Product, products, ProductTypeEnum } from "@/lib/products";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import TemplateListItem from "./list-item";
import TemplateListItemDisabled from "./list-item-disabled";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = generateMeta({
  title: "Free & Premium Website Templates for Shadcn UI",
  description:
    "Free and premium shadcn/ui website templates built with Next.js, React and Tailwind CSS. TypeScript ready, dark mode support and responsive designs for landing pages, portfolios and web apps.",
});

export default function Page() {
  const filteredProducts = products
    .sort((a, b) => b.id - a.id)
    .filter(
      (e) =>
        e.type.key === ProductTypeEnum.Template &&
        e.price !== "0" &&
        e.inTemplates,
    );

  return (
    <section>
      <div className="container border-x px-0">
        <header className="mx-auto max-w-5xl space-y-3 py-8 text-center lg:py-10">
          <h1 className="font-heading text-3xl font-semibold lg:text-5xl">
            Shadcn Website Templates
          </h1>
          <p className="text-muted-foreground text-balance md:text-lg/relaxed">
            Premium and free website templates built with Next.js, Tailwind CSS
            and shadcn/ui. Every template ships with TypeScript, dark mode and a
            fully responsive design, so freelancers, developers and teams can
            launch landing pages, portfolios and web apps in minutes.
          </p>
          <div className="mt-5">
            <Button variant="outline" asChild>
              <Link href="/free-templates">
                Free Templates <ChevronRight />
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
          <TemplateListItemDisabled
            template={{
              name: "Cnstore",
              subtitle: "E-commerce Template",
              short_description:
                "A modern e-commerce website template with product listings, cart and checkout pages.",
              images: [
                {
                  url: "/images/templates/cnstore/01.png",
                  title: "Cnstore Storefront",
                },
                {
                  url: "/images/templates/cnstore/02.png",
                  title: "Cnstore Product Details",
                },
              ],
            }}
          />
          <TemplateListItemDisabled
            template={{
              name: "Saasuk",
              subtitle: "SaaS Landing Page Template",
              short_description:
                "A clean SaaS landing page template with hero, features, pricing and testimonial sections.",
              images: [
                {
                  url: "/images/templates/saasuk/01.png",
                  title: "Saasuk Landing Page",
                },
                {
                  url: "/images/templates/saasuk/02.jpeg",
                  title: "Saasuk Landing Page Sections",
                },
              ],
            }}
          />
          <TemplateListItemDisabled
            template={{
              name: "Layer",
              subtitle: "CRM Admin Dashboard Template",
              short_description:
                "A CRM admin dashboard template with contacts, deals, pipelines and analytics pages.",
              images: [
                {
                  url: "/images/templates/layer/01.png",
                  title: "Layer CRM Dashboard",
                },
                {
                  url: "/images/templates/layer/02.png",
                  title: "Layer CRM Pipeline",
                },
              ],
            }}
          />
        </div>
      </div>
    </section>
  );
}
