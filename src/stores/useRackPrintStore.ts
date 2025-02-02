// file: stores/useRackPrintStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RackPrintData {
  id: string;
  location: string;
  kandang: string;
  rack: string;
}

interface RackPrintStore {
  selectedRacks: RackPrintData[];
  setSelectedKeys: (items: RackPrintData[]) => void;
}

const useRackPrintStore = create<RackPrintStore>()(
  persist(
    (set) => ({
      selectedRacks: [],
      setSelectedKeys: (items) => set(() => ({ selectedRacks: items })),
    }),
    {
      name: "rack-print-storage", // key storage di localStorage
      // storage: createJSONStorage(() => sessionStorage), // misal pakai sessionStorage
    }
  )
);

export default useRackPrintStore;
