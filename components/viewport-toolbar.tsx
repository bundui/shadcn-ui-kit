"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  useComponentDevicePreviewStore,
  type ViewportDevice,
} from "@/store/component-device-preview";
import { useIsMobile } from "@/hooks/use-mobile";

const DEVICES: {
  value: ViewportDevice;
  icon: typeof Smartphone;
  label: string;
}[] = [
  { value: "mobile", icon: Smartphone, label: "Mobile" },
  { value: "tablet", icon: Tablet, label: "Tablet" },
  { value: "desktop", icon: Monitor, label: "Desktop" },
];

type ViewportToolbarProps = {
  componentId: string;
};

export default function ViewportToolbar({ componentId }: ViewportToolbarProps) {
  const isMobile = useIsMobile();
  const value = useComponentDevicePreviewStore((s) => s.getDevice(componentId));
  const setDevice = useComponentDevicePreviewStore((s) => s.setDevice);

  if (isMobile) {
    return null;
  }

  return (
    <ButtonGroup aria-label="Preview size">
      {DEVICES.map(({ value: deviceValue, icon: Icon, label }) => (
        <Button
          key={deviceValue}
          variant="outline"
          size="icon"
          aria-label={label}
          aria-pressed={value === deviceValue}
          onClick={() => setDevice(componentId, deviceValue)}
          className={cn(value === deviceValue && "bg-muted")}
        >
          <Icon />
        </Button>
      ))}
    </ButtonGroup>
  );
}
