import { Alert, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export default function AlertComponent() {
  return (
    <Alert className="text-green-600">
      <CheckCircle2Icon className="size-4" />
      <AlertTitle className="text-green-600">Payment successful</AlertTitle>
    </Alert>
  );
}
