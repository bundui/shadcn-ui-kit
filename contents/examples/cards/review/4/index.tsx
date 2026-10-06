import { StarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(Math.max(value - i, 0), 1);
        return (
          <span key={i} className="relative inline-block size-6">
            <StarIcon className="size-6 fill-muted text-muted" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <StarIcon className="size-6 fill-amber-400 text-amber-400" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function ReviewCard() {
  return (
    <Card className="w-full shadow-none md:w-[420px]">
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&h=80&fit=crop&crop=face"
            alt="Shasha Kamala"
            className="size-14 rounded-full object-cover"
          />
          <div>
            <p className="font-semibold">Shasha Kamala</p>
            <p className="text-sm text-muted-foreground">Verified Customer</p>
          </div>
        </div>

        <Stars value={3.5} />

        <p className="text-muted-foreground leading-relaxed">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Scelerisque eleifend donec pretium vulputate.
        </p>
      </CardContent>
    </Card>
  );
}
