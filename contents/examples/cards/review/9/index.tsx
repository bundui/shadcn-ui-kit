import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReviewCard() {
  return (
    <Card className="w-full gap-0 overflow-hidden py-0 shadow-none md:w-[480px]">
      <CardContent className="flex p-0!">
        <div className="w-48 shrink-0 self-stretch">
          <img
            src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=560&fit=crop&crop=face"
            alt="Harsh P."
            className="h-full w-full object-cover object-top"
          />
        </div>

        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className="size-4 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-lg leading-snug font-semibold">
              You have the right place
            </p>
            <p className="relative text-sm leading-relaxed text-muted-foreground before:mr-0.5 before:font-serif before:text-xl before:content-['\201C'] after:ml-0.5 after:font-serif after:text-xl after:content-['\201D']">
              This platform has made it possible for me to stay on top of my
              portfolio and make informed decisions quickly and easily.
            </p>
          </div>

          <div className="mt-auto border-t pt-3">
            <p className="text-sm font-semibold">Harsh P.</p>
            <p className="text-xs font-medium text-primary">Product Designer</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
