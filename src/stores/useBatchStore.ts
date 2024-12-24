import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BatchState {
  batchId: string | null;
  setBatchId: (id: string) => void;
  clearBatchId: () => void;
}

const useBatchStore = create<BatchState>()(
  persist(
    (set) => ({
      batchId: null,

      setBatchId: (id) => set({ batchId: id }),

      clearBatchId: () => set({ batchId: null }),
    }),
    {
      name: 'batch-storage', // Key untuk penyimpanan di localStorage
      partialize: (state) => ({ batchId: state.batchId }), // Hanya simpan batchId
    },
  ),
);

export default useBatchStore;
