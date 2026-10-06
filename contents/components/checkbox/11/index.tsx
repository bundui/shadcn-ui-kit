import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Component() {
  return (
    <div className="space-y-2">
      <Label className="hover:bg-accent/50 flex items-start gap-2 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
        <Checkbox
          defaultChecked
          className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700"
        />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">Email Notifications</p>
          <p className="text-muted-foreground text-sm">Receive updates via email.</p>
        </div>
      </Label>
      <Label className="hover:bg-accent/50 flex items-start gap-2 rounded-lg border p-3 has-aria-checked:border-blue-600 has-aria-checked:bg-blue-50 dark:has-aria-checked:border-blue-900 dark:has-aria-checked:bg-blue-950">
        <Checkbox className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-700" />
        <div className="grid gap-1.5 font-normal">
          <p className="text-sm leading-none font-medium">Push Notifications</p>
          <p className="text-muted-foreground text-sm">Get real-time alerts on your device</p>
        </div>
      </Label>
    </div>
  );
}
