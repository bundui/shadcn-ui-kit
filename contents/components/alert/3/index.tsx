import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle2Icon } from "lucide-react";

export default function AlertComponent() {
  return (
    <Alert>
      <CheckCircle2Icon className="size-4" />
      <AlertTitle>Success! Your changes have been saved</AlertTitle>
      <AlertDescription>This is an alert with icon, title and description.</AlertDescription>
    </Alert>
  );
}
