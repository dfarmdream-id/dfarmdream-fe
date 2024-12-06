import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Interface untuk mendefinisikan state dan actions dari store.
 */
interface LocationState {
  /**
   * ID lokasi atau site yang sedang dipilih.
   */
  siteId: string | null;

  /**
   * Fungsi untuk mengatur nilai siteId.
   * @param id - ID lokasi baru yang akan disimpan.
   */
  setSiteId: (id: string) => void;

  /**
   * Fungsi untuk menghapus nilai siteId.
   */
  clearSiteId: () => void;
}

/**
 * Zustand store dengan persist untuk menyimpan state ke localStorage.
 */
const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      siteId: null, // Nilai awal untuk siteId

      // Action untuk mengatur siteId baru
      setSiteId: (id) => set(() => ({ siteId: id })),

      // Action untuk mereset siteId
      clearSiteId: () => set(() => ({ siteId: null })),
    }),
    {
      name: 'location-storage', // Key yang digunakan di localStorage
    },
  ),
);

export default useLocationStore;
