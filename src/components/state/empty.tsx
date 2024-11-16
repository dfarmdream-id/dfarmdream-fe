"use client";
import Empty from "@/assets/lottie/empty.json";
import Lootie from "lottie-react";

export default function EmptyState() {
  return (
    <div>
      <Lootie className="max-w-xs mx-auto" animationData={Empty} />
      <div className="mt-3 text-slate-600">
        <div className="text-2xl font-semibold text-primary">Data Tidak Ditemukan</div>
        <div className="text-sm">Silahkan tambahkan data di menu tambah</div>
      </div>
    </div>
  );
}
