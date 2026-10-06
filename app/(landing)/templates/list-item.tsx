import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/products";
import { SquareArrowOutUpRight } from "lucide-react";

export default function TemplateListItem({ template }: { template: Product }) {
  return (
    <div className="relative grid items-center gap-8 p-4 lg:grid-cols-5 lg:ps-6!">
      <div className="col-span-2 space-y-3">
        <h2 className="text-xl lg:text-2xl font-heading font-semibold">
          <Link href={`/template/${template.slug}`}>
            {template.name} -{" "}
            <span className="text-muted-foreground">{template.subtitle}</span>
          </Link>
        </h2>
        <p className="text-muted-foreground">{template.short_description}</p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href={`/template/${template.slug}`}>Template Details</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link target="_blank" href={template?.preview_url ?? "#"}>
              Preview Demo <SquareArrowOutUpRight />
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative col-span-3">
        <div className="grid gap-4 md:grid-cols-2">
          <Link
            className="absolute inset-0 z-10 lg:left-8"
            href={`/template/${template.slug}`}
            aria-label={`${template.name} template details`}
          ></Link>
          {template.images?.length
            ? template.images.slice(0, 2).map((image, key) => (
                <figure className="rounded-xl border p-1" key={key}>
                  <Image
                    className="aspect-video w-full rounded-lg object-cover object-top"
                    src={image.url}
                    alt={image.title.toLocaleLowerCase()}
                    width={800}
                    height={450}
                    sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw"
                  />
                </figure>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}
