import { create } from "zustand";

export type ViewportDevice = "mobile" | "tablet" | "desktop";

interface ComponentDevicePreviewStore {
  deviceByComponentId: Record<string, ViewportDevice>;
  setDevice: (componentId: string, device: ViewportDevice) => void;
  getDevice: (componentId: string) => ViewportDevice;
}

export const useComponentDevicePreviewStore =
  create<ComponentDevicePreviewStore>((set, get) => ({
    deviceByComponentId: {},
    setDevice: (componentId, device) =>
      set((state) => ({
        deviceByComponentId: {
          ...state.deviceByComponentId,
          [componentId]: device,
        },
      })),
    getDevice: (componentId) =>
      get().deviceByComponentId[componentId] ?? "desktop",
  }));
