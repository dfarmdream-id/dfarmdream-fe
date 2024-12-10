"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {useState} from "react";
import {Button} from "@nextui-org/react";
import {TbFileTypePdf} from "react-icons/tb";

export default function BalanceSheet() {
  const aktivaLancar = [
    { name: "Kas & Bank", value: "XXX" },
    { name: "Piutang Dagang", value: "XXX" },
    { name: "Persediaan", value: "XXX" },
    { name: "Pembayaran Diterima di Muka", value: "XXX" },
  ];

  const aktivaTidakLancar = [
    { name: "Aset Tanah dan Bangunan", value: "XXX" },
    { name: "Akumulasi Depresiasi Tanah & Bangunan", value: "(XXX)" },
    { name: "Aset Peralatan", value: "XXX" },
    { name: "Akumulasi Depresiasi Peralatan", value: "(XXX)" },
    { name: "Aset Furniture", value: "XXX" },
    { name: "Akumulasi Depresiasi Furniture", value: "(XXX)" },
  ];

  const hutangLancar = [
    { name: "Hutang Dagang", value: "XXX" },
    { name: "Hutang Usaha", value: "XXX" },
    { name: "Hutang Lainnya", value: "XXX" },
  ];

  const ekuitas = [
    { name: "Modal Disetor", value: "XXX" },
    { name: "Laba Ditahan", value: "XXX" },
    { name: "Laba / Rugi Berjalan", value: "XXX" },
  ];
  
  const [loading, setLoading] = useState(false); // State untuk loading

  const downloadPDF = async () => {
    setLoading(true); // Mulai proses, tampilkan loading
    try {
      const element = document.getElementById("balance-sheet");
      const canvas = await html2canvas(element!); // Render elemen ke canvas
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("BalanceSheet.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false); // Selesai proses, sembunyikan loading
    }
  };

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-end">
        <Button
          color="primary"
          onClick={downloadPDF}
          startContent={<TbFileTypePdf  />}
          disabled={loading}
          className="w-full md:w-auto"
        >
            {
              loading ? "Loading..." : "Download Neraca"
            }
        </Button>
      </div>
      <div id="balance-sheet" className="grid grid-cols-1 gap-8">
        <div className="bg-neutral-50 p-6 rounded-lg">
          <div>
            <h1 className="text-3xl font-bold">NERACA</h1>
            <p className="text-lg font-medium">PT XXX</p>
            <p className="text-sm">Per XXX</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Aktiva */}
            <div className="bg-gray-50 py-6 rounded-lg">
              <h2 className="text-md font-bold mb-4 text-center">AKTIVA</h2>

              {/* Aktiva Lancar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between font-semibold text-md pb-4">
                  <span>AKTIVA LANCAR</span>
                </div>
                {aktivaLancar.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-md pt-4">
                  <span>TOTAL AKTIVA LANCAR</span>
                  <span className="font-medium">XXX</span>
                </div>
              </div>

              {/* Aktiva Tidak Lancar */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-md pb-4 pt-3">
                  <span>AKTIVA TIDAK LANCAR</span>
                </div>
                {aktivaTidakLancar.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-md pt-4">
                  <span> TOTAL AKTIVA TIDAK LANCAR</span>
                  <span className="font-medium">XXX</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-md pt-5">
                  <span>TOTAL AKTIVA</span>
                  <span className="font-medium">XXX</span>
                </div>
              </div>
            </div>

            {/* Passiva */}
            <div className="bg-gray-50 py-6 rounded-lg">
              <h2 className="text-md font-bold mb-4 text-center">PASSIVA</h2>

              {/* Hutang Lancar */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between font-semibold text-md pb-4">
                  <span>HUTANG LANCAR</span>
                </div>
                {hutangLancar.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-md">
                  <span className="text-gray-50">T</span>
                </div>
                <div className="flex justify-between font-semibold text-md pt-4">
                  <span>TOTAL HUTANG LANCAR</span>
                  <span className="font-medium">XXX</span>
                </div>
              </div>

              {/* Ekuitas */}
              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-md pb-4 pt-3">
                  <span>EKUITAS</span>
                </div>
                {ekuitas.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span>{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-md">
                  <span className="text-gray-50">T</span>
                </div>
                <div className="flex justify-between font-semibold text-md">
                  <span className="text-gray-50">T</span>
                </div>
                <div className="flex justify-between font-semibold text-md">
                  <span className="text-gray-50">T</span>
                </div>
                <div className="flex justify-between font-semibold text-md pt-4">
                  <span>TOTAL EKUITAS</span>
                  <span className="font-medium">XXX</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-semibold text-md pt-5">
                  <span>TOTAL PASSIVA</span>
                  <span className="font-medium">XXX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
