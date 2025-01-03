"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {useMemo, useState} from "react";
import {Button, Select, SelectItem} from "@nextui-org/react";
import { TbFileTypePdf } from "react-icons/tb";
import { useGetJournalBalanceSheet } from "@/app/(authenticated)/_services/journal";
import {useQueryState} from "nuqs";
import {useGetJournalProfitLoss} from "@/app/(authenticated)/_services/profit-loss";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";
import Logo from "@/components/assets/logo";

export default function BalanceSheet() {
  // const aktivaLancar = [101, 102, 121, 124, 125, 141, 142];
  // const aktivaTidakLancar = [131, 132];
  // const hutangLancar = [201];
  // const ekuitas = [301];
  
  const kasDanSetaraKas = [101, 102];
  const persediaan = [121, 124, 125];
  const piutang = [141, 142];
  
  const assetTetap = [131, 132];
    
  const utangDagang = [201];
  
  const modal = [301];

  const [loading, setLoading] = useState(false);
  
  const [month, setMonth] = useQueryState("month", { throttleMs: 1000 });
  const [year, setYear] = useQueryState("year", { throttleMs: 1000 });

  const [cageId, setCageId] = useQueryState("cageId", { throttleMs: 1000 });
  const [batchId, setBatchId] = useQueryState("batchId", { throttleMs: 1000 });

  const balanceSheets = useGetJournalBalanceSheet(
    useMemo(
      () => ({
        month: month || "0",
        year: year || "0",
        ...(cageId ? { cageId } : {}),
        ...(batchId ? { batchId } : {}),
      }),
      [year,cageId, batchId]
    )
  );

  const profitLoss = useGetJournalProfitLoss(
    useMemo(
      () => ({
        month: month || "0",
        year: year || "0",
        ...(cageId ? { cageId } : {}),
        ...(batchId ? { batchId } : {}),
      }),
      [year,cageId,batchId]
    )
  );

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const downloadPDF = async () => {
    setLoading(true);
    try {
      const element = document.getElementById("balance-sheet") as HTMLElement;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("BalanceSheet.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const {siteId} = useLocationStore();

  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "100", siteId: siteId ?? "" }),
      [siteId]
    )
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-start">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Select Bulan */}
          <div className="flex-grow sm:flex-grow-0 sm:w-auto">
            <Select
              placeholder="Pilih Bulan"
              labelPlacement="outside"
              variant="bordered"
              onChange={(e) => {
                setMonth(e.target.value);
              }}
              className="w-full min-w-[150px]" // Menambahkan lebar minimum
            >
              <SelectItem key="1" value="1">January</SelectItem>
              <SelectItem key="2" value="2">February</SelectItem>
              <SelectItem key="3" value="3">March</SelectItem>
              <SelectItem key="4" value="4">April</SelectItem>
              <SelectItem key="5" value="5">May</SelectItem>
              <SelectItem key="6" value="6">June</SelectItem>
              <SelectItem key="7" value="7">July</SelectItem>
              <SelectItem key="8" value="8">August</SelectItem>
              <SelectItem key="9" value="9">September</SelectItem>
              <SelectItem key="10" value="10">October</SelectItem>
              <SelectItem key="11" value="11">November</SelectItem>
              <SelectItem key="12" value="12">December</SelectItem>
            </Select>
          </div>

          {/* Select Tahun */}
          <div className="flex-grow sm:flex-grow-0 sm:w-auto">
            <Select
              placeholder="Pilih Tahun"
              labelPlacement="outside"
              variant="bordered"
              onChange={(e) => {
                setYear(e.target.value);
              }}
              className="w-full min-w-[120px]"
            >
              {
                new Array(10).fill(0).map((_, index) => {
                  const year = new Date().getFullYear() - index;
                  return (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  )
                })
              }
            </Select>
          </div>

          {/* Cage Selection */}
          <div className="flex-grow sm:flex-grow-0 sm:w-auto">
            <Select
              isLoading={cagesData.isLoading}
              labelPlacement="outside"
              variant="bordered"
              placeholder="Pilih Kandang"
              className="w-full min-w-[200px]"
              onChange={(value) => setCageId(value.target.value as string)}
            >
              {cagesData.data?.data?.data?.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              )) || []}
            </Select>
          </div>

          {/* Filter Batch */}
          <div className="flex-grow sm:flex-grow-0 sm:w-auto">
            <FilterBatch
              disableLabel={true}
              onBatchIdChange={(value) => setBatchId(value)}
              className="w-full min-w-[200px]"
            />
          </div>

          {/* Button */}
          <div className="w-full sm:w-auto">
            <Button
              color="primary"
              onClick={downloadPDF}
              startContent={<TbFileTypePdf/>}
              disabled={loading}
              className="w-full md:w-auto"
            >
              {loading ? "Loading..." : "Download Neraca"}
            </Button>
          </div>
        </div>
      </div>
      <div id="balance-sheet" className="mx-auto p-8 bg-white rounded border">
        <div className="mb-8 flex items-center justify-between">
          {/* Teks Header */}
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Neraca Saldo
            </h1>
            <p className="text-gray-700">Dfarm Dream</p>
            <p className="text-gray-700">
              As at{" "}
              {month
                ? `${new Date().toLocaleString("id-ID", {month: "long"})} ${year}`
                : "..."}
            </p>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo className="w-[150px] object-contain" />
          </div>
        </div>


        <div className="text-right mb-4 border-t pt-2">
          <span className="text-gray-700">{
            new Date().toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          }</span>
        </div>

        {/* Assets Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold border-t border-b py-2">Aset</h2>

          {/* Aset Lancar */}
          <div className="mt-4">
            <h3 className="font-medium border-b">Aset Lancar</h3>
            <div className="ml-4">
              <div className="py-2">
                <span className="font-medium">1. Kas dan Setara Kas</span>
                <div className="ml-4">
                  {
                    balanceSheets.data?.data?.trialBalance?.map((balanceSheet) => {
                      if (kasDanSetaraKas.includes(Number(balanceSheet.coa.code))) {
                        return (
                          <div key={balanceSheet.coa.code} className="flex justify-between items-center py-1">
                            <span className="text-gray-700">{balanceSheet.coa.name}:</span>
                            <span>{formatCurrency(balanceSheet._sum.debit - balanceSheet._sum.credit)}</span>
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
              <div className="py-2">
                <span className="font-medium">2. Persediaan</span>
                <div className="ml-4">
                  {
                    balanceSheets.data?.data?.trialBalance?.map((balanceSheet) => {
                      if (persediaan.includes(Number(balanceSheet.coa.code))) {
                        return (
                          <div key={balanceSheet.coa.code} className="flex justify-between items-center py-1">
                            <span className="text-gray-700">{balanceSheet.coa.name}:</span>
                            <span>{formatCurrency(balanceSheet._sum.debit - balanceSheet._sum.credit)}</span>
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
              <div className="py-2">
                <span className="font-medium">3. Piutang Usaha</span>
                <div className="ml-4">
                  {
                    balanceSheets.data?.data?.trialBalance?.map((balanceSheet) => {
                      if (piutang.includes(Number(balanceSheet.coa.code))) {
                        return (
                          <div key={balanceSheet.coa.code} className="flex justify-between items-center py-1">
                            <span className="text-gray-700">{balanceSheet.coa.name}:</span>
                            <span>{formatCurrency(balanceSheet._sum.debit - balanceSheet._sum.credit)}</span>
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
              <div className="flex justify-between items-center font-medium border-t py-2">
                <span>Total Aset Lancar:</span>
                <span>
                  {
                    formatCurrency(balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                      if (kasDanSetaraKas.includes(Number(balanceSheet.coa.code)) ||
                        persediaan.includes(Number(balanceSheet.coa.code)) ||
                        piutang.includes(Number(balanceSheet.coa.code))) {
                        return total + (balanceSheet._sum.debit - balanceSheet._sum.credit);
                        
                      }
                      return total;
                    }, 0))
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Aset Tidak Lancar */}
          <div className="mt-4">
            <h3 className="font-medium border-b">Aset Tidak Lancar</h3>
            <div className="ml-4">
              <div className="py-2">
                <span className="font-medium">1. Aset Tetap</span>
                <div className="ml-4">
                  {
                    balanceSheets.data?.data?.trialBalance?.map((balanceSheet) => {
                      if (assetTetap.includes(Number(balanceSheet.coa.code))) {
                        return (
                          <div key={balanceSheet.coa.code} className="flex justify-between items-center py-1">
                            <span className="text-gray-700">{balanceSheet.coa.name}:</span>
                            <span>{formatCurrency(balanceSheet._sum.debit - balanceSheet._sum.credit)}</span>
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
              <div className="flex justify-between items-center font-medium border-t py-2">
                <span>Total Aset Tidak Lancar:</span>
                <span>
                  {
                    formatCurrency(balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                      if (assetTetap.includes(Number(balanceSheet.coa.code))) {
                        return total + (balanceSheet._sum.debit - balanceSheet._sum.credit);
                      }
                      return total;
                    }, 0))
                  }
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center font-semibold mt-4 border-t py-2">
            <span>Total Aset:</span>
            <span>
              {
                formatCurrency(balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                  if (kasDanSetaraKas.includes(Number(balanceSheet.coa.code)) ||
                    persediaan.includes(Number(balanceSheet.coa.code)) ||
                    piutang.includes(Number(balanceSheet.coa.code)) ||
                    assetTetap.includes(Number(balanceSheet.coa.code))) {
                    return total + (balanceSheet._sum.debit - balanceSheet._sum.credit);
                  }
                  return total;
                }, 0))
              }
            </span>
          </div>
        </div>

        {/* Kewajiban Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold border-t border-b py-2">Kewajiban</h2>

          <div className="mt-4">
            <h3 className="font-medium border-b">Kewajiban Lancar</h3>
            <div className="ml-4">
              <div className="py-2">
                <span className="font-medium">1. Utang Usaha</span>
                <div className="ml-4">
                  {
                    balanceSheets.data?.data?.trialBalance?.map((balanceSheet) => {
                      if (utangDagang.includes(Number(balanceSheet.coa.code))) {
                        return (
                          <div key={balanceSheet.coa.code} className="flex justify-between items-center py-1">
                            <span className="text-gray-700">{balanceSheet.coa.name}:</span>
                            <span>{formatCurrency(balanceSheet._sum.credit - balanceSheet._sum.debit)}</span>
                          </div>
                        );
                      }
                    })
                  }
                </div>
              </div>
              <div className="flex justify-between items-center font-medium border-t py-2">
                <span>Total Kewajiban:</span>
                <span>
                  {
                    formatCurrency(balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                      if (utangDagang.includes(Number(balanceSheet.coa.code))) {
                        return total + (balanceSheet._sum.credit - balanceSheet._sum.debit);
                      }
                      return total;
                    }, 0))
                  }
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ekuitas Section */}
        <div>
          <h2 className="text-lg font-semibold border-t border-b py-2">Ekuitas</h2>
          <div className="ml-4">
            <div className="py-2">
              <span className="font-medium">1. Modal Pemilik</span>
              <div className="ml-4">
                {
                  balanceSheets.data?.data?.trialBalance?.map((balanceSheet) => {
                    if (modal.includes(Number(balanceSheet.coa.code))) {
                      return (
                        <div key={balanceSheet.coa.code} className="flex justify-between items-center py-1">
                          <span className="text-gray-700">{balanceSheet.coa.name}:</span>
                          <span>{formatCurrency(balanceSheet._sum.credit - balanceSheet._sum.debit)}</span>
                        </div>
                      );
                    }
                  })
                }
              </div>
            </div>
            <div className="py-2">
              <span className="font-medium">2. Laba Ditahan</span>
              <div className="ml-4">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-700">Laba bersih dari laporan laba rugi:</span>
                  <span>{
                    formatCurrency(profitLoss.data?.data?.netProfit)
                  }</span>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center font-medium border-t py-2">
              <span>Total Ekuitas:</span>
              <span>
                {
                  formatCurrency(
                    (balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                      if (modal.includes(Number(balanceSheet.coa.code))) {
                        return total + (balanceSheet._sum.credit - balanceSheet._sum.debit);
                      }
                      return total;
                    }, 0) || 0) + (profitLoss.data?.data?.netProfit || 0)
                  )
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center font-semibold mt-4 border-t py-2">
          <span>Total Kewajiban dan Ekuitas:</span>
          <span>
            {
              formatCurrency(
                (balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                  if (
                    utangDagang.includes(Number(balanceSheet.coa.code)) ||
                    modal.includes(Number(balanceSheet.coa.code))
                  ) {
                    return total + (balanceSheet._sum.credit - balanceSheet._sum.debit);
                  }
                  return total;
                }, 0) || 0) + (profitLoss.data?.data?.netProfit || 0)
              )
            }
          </span>
        </div>
      </div>
    </div>
  );
}

