"use client";

import { useEffect } from "react";
import { useSearchParam } from "react-use";
import QRCode from "react-qr-code";
import Logo from "@/components/assets/logo";
import useRackPrintStore from "@/stores/useRackPrintStore";

export default function PrintCage() {
  const print = useSearchParam("print");
  const { selectedRacks } = useRackPrintStore();

  // Otomatis print jika ?print=true & data ada
  useEffect(() => {
    if (print === "true" && selectedRacks.length > 0) {
      window.print();
    }
  }, [print, selectedRacks]);

  return (
    <div className="p-4">
      {/* Logo hanya muncul saat non-print */}
      <div className="print:hidden flex justify-center mb-4">
        <Logo />
      </div>

      {/* Grid 3 kolom saat layar besar & cetak */}
      <div
        className="
          grid
          grid-cols-3 sm:grid-cols-4 md:grid-cols-4
          gap-y-8
          gap-x-4
          print:grid-cols-4
        "
      >
        {selectedRacks.map((item) => (
          <div
            key={item.id}
            // Lebar tetap w-40 => 160px,
            // padding kecil agar QR 160px pas muat.
            className="
              w-40 
              border border-gray-300 
              p-2 
              bg-white 
              break-inside-avoid-page
              text-sm print:text-xs print:leading-tight
            "
          >
            <table className="w-full text-left mb-2">
              <tbody>
              <tr className="bg-gray-100">
                <td className="px-1 py-1 font-semibold">Lokasi</td>
                <td className="px-1 py-1">{item.location}</td>
              </tr>
              <tr>
                <td className="px-1 py-1 font-semibold">Kandang</td>
                <td className="px-1 py-1">{item.kandang}</td>
              </tr>
              <tr className="bg-gray-100">
                <td className="px-1 py-1 font-semibold">Rack</td>
                <td className="px-1 py-1">{item.rack}</td>
              </tr>
              </tbody>
            </table>

            {/* QRCode berukuran 160px, sama seperti .w-40 */}
            <QRCode
              value={`rack|${item.id}`}
              size={144}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
