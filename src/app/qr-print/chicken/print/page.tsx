"use client";

import { useEffect } from "react";
import { useSearchParam } from "react-use";
import QRCode from "react-qr-code";
import useChickenPrintStore from "@/stores/useChickenPrintStore";

export default function PrintChickenPage() {
  const print = useSearchParam("print");
  const { selectedChickens } = useChickenPrintStore();

  useEffect(() => {
    if (print === "true" && selectedChickens.length > 0) {
      window.print();
    }
  }, [print, selectedChickens]);

  return (
    <div className="p-4">
      <div className="label-grid gap-2">
        {selectedChickens.map((chicken) => (
          <div
            key={chicken.id}
            className="
              label-box
              flex items-center gap-2
              border border-gray-300 bg-white
              p-1 
              text-[5px] leading-tight
              break-inside-avoid-page
            "
          >
            {/* Teks (kiri) */}
            <div>
              <div className="flex justify-between bg-slate-100 px-1 py-[2px] mb-[2px]">
                <span className="font-semibold">Lokasi</span>
                <span>{chicken.location}</span>
              </div>
              <div className="flex justify-between px-1 py-[2px] mb-[2px]">
                <span className="font-semibold">Kandang</span>
                <span>{chicken.kandang}</span>
              </div>
              <div className="flex justify-between bg-slate-100 px-1 py-[2px] mb-[2px]">
                <span className="font-semibold">Rack</span>
                <span>{chicken.rack}</span>
              </div>
              <div className="flex justify-between px-1 py-[2px]">
                <span className="font-semibold">Batch</span>
                <span>{chicken.batch}</span>
              </div>
            </div>

            {/* QR code (kanan) */}
            <div className="shrink-0">
              <QRCode
                value={`chicken|${chicken.id}`}
                size={60}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
