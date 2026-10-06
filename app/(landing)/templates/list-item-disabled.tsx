import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SquareArrowOutUpRight } from "lucide-react";

type DisabledTemplate = {
  name: string;
  subtitle: string;
  short_description: string;
  images: { url: string; title: string }[];
};

export default function TemplateListItemDisabled({
  template,
}: {
  template: DisabledTemplate;
}) {
  return (
    <div
      aria-disabled="true"
      className="relative grid cursor-not-allowed items-center gap-8 p-4 select-none lg:grid-cols-5 lg:ps-6!"
    >
      <div className="col-span-2 space-y-3">
        <Badge
          variant="secondary"
          className="lg:absolute lg:top-1/2 lg:left-0 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:-rotate-90"
        >
          Coming Soon
        </Badge>
        <h2 className="font-heading text-xl font-semibold lg:text-2xl">
          {template.name} -{" "}
          <span className="text-muted-foreground">{template.subtitle}</span>
        </h2>
        <p className="text-muted-foreground">{template.short_description}</p>
        <div className="flex gap-3">
          <Button disabled>Template Details</Button>
          <Button variant="outline" disabled>
            Preview Demo <SquareArrowOutUpRight />
          </Button>
        </div>
      </div>
      <div className="relative col-span-3">
        <div className="grid gap-4 md:grid-cols-2">
          {template.images.slice(0, 2).map((image, key) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
