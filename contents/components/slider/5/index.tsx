import { Slider } from "@/components/ui/slider";
import { Volume2Icon, VolumeOffIcon } from "lucide-react";

export default function ProgressComponent() {
  return (
    <div className="flex w-full max-w-xs gap-4 font-medium">
      <VolumeOffIcon className="text-muted-foreground size-5 shrink-0" />
      <Slider defaultValue={[80]} max={100} />
      <Volume2Icon className="text-muted-foreground size-5 shrink-0" />
    </div>
  );
}
