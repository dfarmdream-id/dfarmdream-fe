"use client";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {useMemo, useState} from "react";
import {
  Button,
  Select,
  SelectItem,
  Spinner, Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from "@nextui-org/react";
import {TbFileTypePdf} from "react-icons/tb";
import {useGetJournalBalanceSheet} from "@/app/(authenticated)/_services/journal";
import {useQueryState} from "nuqs";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";
import Logo from "@/components/assets/logo";
import EmptyState from "@/components/state/empty";

export default function BalanceSheet() {
  const [loading, setLoading] = useState(false);

  const [month, setMonth] = useQueryState("month", {throttleMs: 1000});
  const [year, setYear] = useQueryState("year", {throttleMs: 1000});

  const [cageId, setCageId] = useQueryState("cageId", {throttleMs: 1000});
  const [batchId, setBatchId] = useQueryState("batchId", {throttleMs: 1000});

  const balanceSheets = useGetJournalBalanceSheet(
    useMemo(
      () => ({
        month: month || "0",
        year: year || "0",
        ...(cageId ? {cageId} : {}),
        ...(batchId ? {batchId} : {}),
      }),
      [cageId, batchId]
    )
  );

  const formatCurrency = (value: any) => {
    if (value === undefined) {
      return "0";
    }

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
      () => ({page: "1", limit: "100", siteId: siteId ?? ""}),
      [siteId]
    )
  );

  const columns = [
    {
      key: "code",
      label: "Kode",
    },
    {
      key: "name",
      label: "Nama Coa",
    },
    {
      key: "balance",
      label: "Saldo (D/K)",
    }
  ]

  return (
    <div className="p-6 space-y-8">
      <div className="mx-auto p-8 bg-white rounded border">
        <div className="px-3 flex flex-wrap gap-4 items-center">
          {/* Pilih Bulan */}
          <div className="w-full sm:w-auto">
            <Select
              placeholder="Pilih Bulan"
              labelPlacement="outside"
              variant="bordered"
              onChange={(e) => {
                setMonth(e.target.value);
              }}
              selectedKeys={[month as string]}
              className="w-full min-w-[150px]"
            >
              {Array.from({length: 12}, (_, i) => (
                <SelectItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('default', {month: 'long'})}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Pilih Tahun */}
          <div className="w-full sm:w-auto">
            <Select
              placeholder="Pilih Tahun"
              labelPlacement="outside"
              variant="bordered"
              onChange={(e) => {
                setYear(e.target.value);
              }}
              renderValue={(value) => (
                <span className="text-black">
          {value[0]?.key === "placeholder" ? "Pilih Tahun" : value[0]?.key}
        </span>
              )}
              selectedKeys={[year as string]}
              className="w-full min-w-[120px]"
            >
              {new Array(10).fill(0).map((_, index) => {
                const year = new Date().getFullYear() - index;
                return (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                );
              })}
            </Select>
          </div>

          {/* Pilih Kandang */}
          <div className="w-full sm:w-auto">
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
          <div className="w-full sm:w-auto">
            <FilterBatch
              disableLabel={true}
              onBatchIdChange={(value) => setBatchId(value)}
              className="w-full min-w-[200px]"
            />
          </div>

          {/* Download Neraca */}
          <div className="w-full sm:w-auto">
            <Button
              color="primary"
              onClick={downloadPDF}
              startContent={<TbFileTypePdf/>}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {loading ? "Loading..." : "Download Neraca"}
            </Button>
          </div>
        </div>
        <div id="balance-sheet" className="p-5">
          <div className="mb-8 flex items-center justify-between">
            {/* Teks Header */}
            <div>
              <h1 className="text-2xl font-bold mb-2">
                General Ledger
              </h1>
              <p className="text-gray-700">Dfarm Dream</p>
              <p className="text-gray-700">
                As at{" "}
                {
                  month
                    ? `${new Date(2025, Number(month) - 1).toLocaleString("id-ID", {month: "long"})} ${year}`
                    : "..."
                }
              </p>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo className="w-[150px] object-contain"/>
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

          <div className="mb-8">
            <div className="mt-4">
              <Table aria-label="Data">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={balanceSheets.data?.data?.trialBalance || []}
                  isLoading={balanceSheets.isLoading}
                  loadingContent={<Spinner />}
                  emptyContent={<EmptyState />}
                >
                  {(item) => (
                    <TableRow
                      key={item.coa.code}
                      className="odd:bg-[#cffdec]"
                      role="button"
                    >
                      <TableCell>
                        <div>{item.coa.code}</div>
                      </TableCell>
                      <TableCell>
                        <div>{item.coa.name}</div>
                      </TableCell>
                      <TableCell>
                        <div>{
                          // if item._sum.debit - item._sum.credit is minus output should be (Rp.23.000.000) else Rp.23.000.000
                          item._sum.debit - item._sum.credit < 0 ? `(${formatCurrency(item._sum.debit - item._sum.credit)})`.toString().replace(
                            "-", ""
                          ) : formatCurrency(item._sum.debit - item._sum.credit)
                        }</div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

