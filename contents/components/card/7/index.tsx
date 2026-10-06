import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CookieConsentCard() {
  return (
    <Card className="w-full max-w-sm shadow-none">
      <CardHeader>
        <CardTitle>Cookie Settings</CardTitle>
        <CardDescription>
          We use cookies to enhance your browsing experience, serve personalized
          content, and analyze our traffic. By clicking &quot;Accept All&quot;, you consent to our
          use of cookies.
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Reject</Button>
        <Button>Accept All</Button>
      </CardFooter>
    </Card>
  );
}
