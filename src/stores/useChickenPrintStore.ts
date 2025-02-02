import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ChickenPrintData {
  id: string;        // kalau perlu ID untuk QR code
  location: string;  // contoh: "Majalengka"
  kandang: string;   // contoh: "Kandang 10-Cibulan"
  rack: string;      // contoh: "Rak 130"
  batch: string;     // contoh: "Batch 1 January 2024"
}

interface ChickenPrintStore {
  selectedChickens: ChickenPrintData[];
  setSelectedKeys: (items: ChickenPrintData[]) => void;
}

const useChickenPrintStore = create<ChickenPrintStore>()(
  persist(
    (set) => ({
      selectedChickens: [],
      setSelectedKeys: (items) => set(() => ({ selectedChickens: items })),
    }),
    {
      name: "chicken-print-storage", // key di localStorage (default)
    }
  )
);

export default useChickenPrintStore;
