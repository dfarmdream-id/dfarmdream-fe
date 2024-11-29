"use client";
import Empty from "@/assets/lottie/empty.json";
import Lootie from "lottie-react";

export default function ForbiddenState() {
  return (
    <div>
      <Lootie className="max-w-xs mx-auto" animationData={Empty} />
      <div className="mt-3 text-slate-600">
        <div className="text-2xl font-semibold text-primary">
          Anda tidak memiliki akses
        </div>
        <div className="text-sm">Silahkan hubungi admin</div>
      </div>
    </div>
  );
}
