import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function AlertComponent() {
  return (
    <Alert>
      <AlertCircleIcon className="size-4" />
      <AlertDescription>You can add components to your app using the cli.</AlertDescription>
    </Alert>
  );
}
