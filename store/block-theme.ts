import { create } from "zustand";

interface BlockThemeStore {
  darkModeByKey: Record<string, boolean>;
  setDarkMode: (key: string, isDark: boolean) => void;
}

export const useBlockThemeStore = create<BlockThemeStore>((set) => ({
  darkModeByKey: {},
  setDarkMode: (key, isDark) =>
    set((state) => ({
      darkModeByKey: { ...state.darkModeByKey, [key]: isDark },
    })),
}));
