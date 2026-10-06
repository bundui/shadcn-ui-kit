import { Spinner } from "@/components/ui/spinner";
import { CheckCircle2 } from "lucide-react";

export default function SpinnerComponent() {
  return (
    <div className="grid gap-3 text-sm">
      <div className="flex items-center gap-3">
        <CheckCircle2 className="size-5 fill-green-500 text-primary-foreground" />
        Movement in the Day Care
      </div>
      <div className="flex items-center gap-3">
        <Spinner className="size-5 text-muted-foreground" />
        Free Play: Painting and Crafting
      </div>
      <div className="text-muted-foreground flex items-center gap-3 pl-8">
        Convert PDF
      </div>
      <div className="text-muted-foreground flex items-center gap-3 pl-8">
        Create PDF single pages
      </div>
    </div>
  );
}
