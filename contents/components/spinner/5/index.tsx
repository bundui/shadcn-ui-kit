import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export default function SpinnerComponent() {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled>
        <Spinner data-icon="inline-start" />
        Loading...
      </Button>
    </div>
  );
}
