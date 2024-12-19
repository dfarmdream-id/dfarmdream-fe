export const chickenStatus = [
  { key: "ALIVE", label: "Ayam Hidup dan Sehat" },
  { key: "ALIVE_IN_SICK", label: "Ayam Hidup tetapi Mengalami Penyakit" },
  { key: "DEAD", label: "Ayam Mati tanpa Tanda Penyakit" },
  { key: "DEAD_DUE_TO_ILLNESS", label: "Ayam Mati karena Penyakit" },
  { key: "PRODUCTIVE", label: "Ayam dalam Masa Produktif" },
  { key: "FEED_CHANGE", label: "Ayam Sedang dalam Proses Ganti Pakan" },
  { key: "SPENT", label: "Ayam Sudah Tidak Produktif (Afkir)" },
  { key: "REJUVENATION", label: "Ayam dalam Proses Peremajaan" },
];

export type ChickenStatus =
  | "ALIVE"
  | "ALIVE_IN_SICK"
  | "DEAD"
  | "DEAD_DUE_TO_ILLNESS"
  | "PRODUCTIVE"
  | "FEED_CHANGE"
  | "SPENT"
  | "REJUVENATION";


const statusMap: Record<ChickenStatus, { color: string; label: string }> = {
  ALIVE: { color: "success", label: "Hidup" },
  ALIVE_IN_SICK: { color: "warning", label: "Hidup Sakit" },
  DEAD: { color: "danger", label: "Mati" },
  DEAD_DUE_TO_ILLNESS: { color: "danger", label: "Mati Sakit" },
  PRODUCTIVE: { color: "success", label: "Produktif" },
  FEED_CHANGE: { color: "warning", label: "Ganti Pakan" },
  SPENT: { color: "primary", label: "Tidak Produktif" },
  REJUVENATION: { color: "info", label: "Peremajaan" }, // Tambahkan di sini
};

export const getStatusProps = (status: ChickenStatus | undefined) => {
  const defaultProps = { color: "primary", label: "Status Tidak Diketahui" };
  return status ? statusMap[status] : defaultProps;
};