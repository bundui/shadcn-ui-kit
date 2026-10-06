import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  return (
    <div className="w-full max-w-xs">
      <div>
        <Slider aria-label="Slider with reference labels" defaultValue={[15]} max={35} min={5} />
        <span
          aria-hidden="true"
          className="text-muted-foreground mt-4 flex w-full items-center justify-between gap-1 text-xs font-medium">
          <span>5 GB</span>
          <span>20 GB</span>
          <span>35 GB</span>
        </span>
      </div>
    </div>
  );
}
