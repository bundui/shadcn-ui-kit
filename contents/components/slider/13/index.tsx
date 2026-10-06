import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderComponent() {
  return (
    <div className="flex h-48 justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <Slider
          aria-label="60 Hz"
          defaultValue={[2]}
          max={5}
          min={-5}
          orientation="vertical"
        />
        <Label className="text-muted-foreground flex w-0 justify-center text-xs">60</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          aria-label="250 Hz"
          defaultValue={[1]}
          max={5}
          min={-5}
          orientation="vertical"
        />
        <Label className="text-muted-foreground flex w-0 justify-center text-xs">250</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          aria-label="1k"
          defaultValue={[-1]}
          max={5}
          min={-5}
          orientation="vertical"
        />
        <Label className="text-muted-foreground flex w-0 justify-center text-xs">1k</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          aria-label="4k"
          defaultValue={[-3]}
          max={5}
          min={-5}
          orientation="vertical"
        />
        <Label className="text-muted-foreground flex w-0 justify-center text-xs">4k</Label>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Slider
          aria-label="16k"
          defaultValue={[2]}
          max={5}
          min={-5}
          orientation="vertical"
        />
        <Label className="text-muted-foreground flex w-0 justify-center text-xs">16K</Label>
      </div>
    </div>
  );
}
