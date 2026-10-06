"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  type ViewportDevice,
  useComponentDevicePreviewStore,
} from "@/store/component-device-preview";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { useBlockThemeStore } from "@/store/block-theme";
import { useTheme } from "next-themes";

const VIEWPORT_WIDTH: Record<ViewportDevice, number> = {
  mobile: 375,
  tablet: 768,
  desktop: 0,
};

const PRESET_TOLERANCE_PX = 4;

type ComponentIframeProps = {
  id: number | string;
  url?: string;
  viewportKey?: string;
};

export default function ComponentIframe({
  id,
  url,
  viewportKey,
}: ComponentIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  const device = useComponentDevicePreviewStore((s) =>
    viewportKey ? s.getDevice(viewportKey) : "desktop",
  );
  const setDevice = useComponentDevicePreviewStore((s) => s.setDevice);

  const searchParams = (() => {
    if (!url) return null;
    const query = url.split("?")[1];
    return query ? new URLSearchParams(query) : null;
  })();
  const customHeight = searchParams?.get("height");
  const responsive = searchParams?.get("responsive") !== "false";
  const isMobile = useIsMobile();

  const [height, setHeight] = useState(
    customHeight ? `${customHeight}px` : "300px",
  );
  const [isReady, setIsReady] = useState(Boolean(customHeight));

  const applyDeviceLayout = useCallback((targetDevice: ViewportDevice) => {
    const container = containerRef.current;
    const panelGroup = panelGroupRef.current;
    if (!container?.offsetWidth || !panelGroup) return;

    const targetPx =
      VIEWPORT_WIDTH[targetDevice] === 0
        ? container.offsetWidth
        : VIEWPORT_WIDTH[targetDevice];
    const percent = Math.min((targetPx / container.offsetWidth) * 100, 100);
    panelGroup.setLayout([percent, 100 - percent]);
  }, []);

  useEffect(() => {
    applyDeviceLayout(device);
  }, [device, applyDeviceLayout]);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (
        data?.type === "setHeight" &&
        typeof data.height === "number" &&
        String(data.iframeId) === String(id)
      ) {
        setHeight(`${data.height}px`);
        setIsReady(true);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [id]);

  const { resolvedTheme } = useTheme();
  const darkModeByKey = useBlockThemeStore((s) => s.darkModeByKey);
  const darkModeOverride = viewportKey ? darkModeByKey[viewportKey] : undefined;

  useEffect(() => {
    if (!isReady) return;
    const win = iframeRef.current?.contentWindow;
    if (!win || !resolvedTheme) return;

    const isDark = darkModeOverride ?? resolvedTheme === "dark";

    win.postMessage({ type: "theme", value: isDark ? "dark" : "light" }, "*");
  }, [darkModeOverride, resolvedTheme, isReady]);

  const handleLayout = useCallback(
    (sizes: number[]) => {
      if (!viewportKey || !containerRef.current) return;
      const px = Math.round(
        (sizes[0] / 100) * containerRef.current.offsetWidth,
      );
      const match = (["mobile", "tablet", "desktop"] as const).find(
        (key) =>
          VIEWPORT_WIDTH[key] !== 0 &&
          Math.abs(VIEWPORT_WIDTH[key] - px) < PRESET_TOLERANCE_PX,
      );
      if (match) {
        setDevice(viewportKey, match);
      } else if (sizes[0] > 99) {
        setDevice(viewportKey, "desktop");
      }
    },
    [viewportKey, setDevice],
  );

  return (
    <div
      ref={containerRef}
      className="mx-auto w-full transition-[max-width] duration-200"
    >
      <ResizablePanelGroup
        ref={panelGroupRef}
        direction="horizontal"
        className="w-full overflow-visible!"
        onLayout={handleLayout}
      >
        <ResizablePanel
          defaultSize={100}
          minSize={27}
          className={cn("bg-background", device !== "desktop" && "border-e")}
        >
          <div
            className={cn(
              "relative w-full overflow-hidden rounded-bl-lg",
              device === "desktop" && "rounded-br-lg",
            )}
            style={{ height }}
          >
            {!isReady && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="size-5" />
              </div>
            )}
            <iframe
              ref={iframeRef}
              src={url}
              className={cn("w-full", !isReady && "invisible")}
              style={{ height }}
            />
          </div>
        </ResizablePanel>
        {!isMobile && responsive && (
          <ResizableHandle withHandle className="bg-transparent" />
        )}
        <ResizablePanel defaultSize={0} minSize={0} />
      </ResizablePanelGroup>
    </div>
  );
}
