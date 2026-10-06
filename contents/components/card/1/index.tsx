import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingCard() {
  return (
    <Card className="w-full max-w-xs shadow-none">
      <CardHeader>
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock advanced automation, analytics, and priority support designed
          for SaaS teams to scale faster, optimize operations, and deliver a
          world-class experience to your users.
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Start Free Trial</Button>
      </CardFooter>
    </Card>
  );
}
