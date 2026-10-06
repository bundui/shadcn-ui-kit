import { SmartphoneIcon, MonitorIcon, CloudIcon } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const platforms = [
  { label: "Mobile App", icon: SmartphoneIcon },
  { label: "Desktop App", icon: MonitorIcon },
  { label: "Cloud Service", icon: CloudIcon }
];

export default function Component() {
  return (
    <ul className="flex w-full flex-col divide-y rounded-md border">
      {platforms.map(({ label, icon: Icon }) => (
        <li key={label}>
          <Label htmlFor={label} className="flex items-center justify-between gap-2 px-5 py-3">
            <span className="flex items-center gap-2">
              <Icon className="size-4" /> {label}
            </span>
            <Checkbox id={label} />
          </Label>
        </li>
      ))}
    </ul>
  );
}
