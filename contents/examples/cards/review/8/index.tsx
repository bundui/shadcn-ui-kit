import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block size-5">
            <StarIcon className="size-5 fill-muted text-muted" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-5 fill-amber-400 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewCard() {
  return (
    <Card className="w-full shadow-none md:w-[360px]">
      <CardContent className="space-y-5">
        <div className="flex items-start justify-between">
          <span className="font-serif text-5xl leading-none text-muted-foreground/40 select-none">
            &ldquo;
          </span>
          <Stars value={4.5} />
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare. Suspendisse varius enim in eros elementum tristique."
        </p>

        <div className="flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face"
            alt="Mamad Ahmadi"
            className="size-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold">Mamad Ahmadi</p>
            <p className="text-xs text-muted-foreground">Position, Company name</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
