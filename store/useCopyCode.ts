import { create } from "zustand";

interface codeCopyStore {
  code: string | null;
  setCode: (code: string | null) => void;
}

export const useCodeCopyStore = create<codeCopyStore>((set) => ({
  code: null,
  setCode: (code) => set({ code })
}));
