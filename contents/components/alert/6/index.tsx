import { Alert, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export default function AlertComponent() {
  return (
    <Alert className="text-amber-600">
      <TriangleAlert className="size-4" />
      <AlertTitle className="text-amber-600">
        Hey! You are about to exceed your data limit.
      </AlertTitle>
    </Alert>
  );
}
