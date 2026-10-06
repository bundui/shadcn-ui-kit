"use client";

import { useTheme } from "next-themes";
import { MoonStar, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useBlockThemeStore } from "@/store/block-theme";

export default function IframeDarkToggle({
  viewportKey,
}: {
  viewportKey: string;
}) {
  const { resolvedTheme } = useTheme();
  const darkModeByKey = useBlockThemeStore((s) => s.darkModeByKey);
  const setDarkMode = useBlockThemeStore((s) => s.setDarkMode);

  const isDark =
    viewportKey in darkModeByKey
      ? darkModeByKey[viewportKey]
      : resolvedTheme === "dark";

  function toggle() {
    setDarkMode(viewportKey, !isDark);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon" onClick={toggle}>
            <MoonStar className="size-4 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Sun className="absolute size-4 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <span>{isDark ? "Light mode" : "Dark mode"}</span>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
