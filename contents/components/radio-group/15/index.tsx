import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function RadioGroupComponent() {
  return (
    <RadioGroup className="gap-2" defaultValue="pro">
      <div className="bg-background hover:bg-accent relative flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors">
        <RadioGroupItem className="mt-1" id="free" value="free" />
        <div className="grid flex-1 gap-2 leading-none">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer font-medium" htmlFor="free">
              Starter
            </Label>
            <Badge variant="secondary">$0/mo</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Essential tools to get you started with your projects.
          </p>
          <ul className="text-muted-foreground space-y-1 text-xs">
            <li>• Up to 5 projects</li>
            <li>• 10GB storage</li>
            <li>• Email support</li>
            <li>• Basic templates</li>
          </ul>
        </div>
      </div>
      <div className="bg-background hover:bg-accent relative flex cursor-pointer items-start space-x-3 rounded-lg border p-4 transition-colors">
        <RadioGroupItem className="mt-1" id="pro" value="pro" />
        <div className="grid flex-1 gap-2 leading-none">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer font-medium" htmlFor="pro">
              Professional
            </Label>
            <Badge>$29/mo</Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            Everything you need to scale your business.
          </p>
          <ul className="text-muted-foreground space-y-1 text-xs">
            <li>• Unlimited projects</li>
            <li>• 500GB storage</li>
            <li>• Priority support</li>
            <li>• Advanced analytics & reports</li>
            <li>• Custom integrations</li>
          </ul>
        </div>
      </div>
    </RadioGroup>
  );
}
