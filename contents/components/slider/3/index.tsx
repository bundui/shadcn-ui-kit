import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  const max = 12;
  const skipInterval = 2;
  const ticks = [...Array(max + 1)].map((_, i) => i);

  return (
    <div className="w-full max-w-xs">
      <div>
        <Slider aria-label="Slider with ticks" defaultValue={[5]} max={max} />
        <span
          aria-hidden="true"
          className="text-muted-foreground mt-3 flex w-full items-center justify-between gap-1 px-2.5 text-xs font-medium">
          {ticks.map((_, i) => (
            <span className="flex w-0 flex-col items-center justify-center gap-2" key={String(i)}>
              <span
                className={cn("bg-muted-foreground/70 h-1 w-px", i % skipInterval !== 0 && "h-0.5")}
              />
              <span className={cn(i % skipInterval !== 0 && "opacity-0")}>{i}</span>
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
