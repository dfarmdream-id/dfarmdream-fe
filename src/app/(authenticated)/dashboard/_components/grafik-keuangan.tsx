"use client"

import {Card, CardBody, CardHeader, Select, SelectItem, Spinner} from "@nextui-org/react";
import { useDashboardKeuangan} from "@/app/(authenticated)/_services/dashboard";
import dynamic from "next/dynamic";
import {useMemo, useState, useEffect} from "react";
import { useQueryClient } from "@tanstack/react-query";
import FilterCageRack from "@/app/(authenticated)/dashboard/_components/filterCageRack";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);


export default function GrafiKeuangan (){
  const [year, setYear] = useState<string | null>(
    new Date().getFullYear().toString()
  );
  const queryClient = useQueryClient();

  const [selectedCageId, setSelectedCageId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);

  const chartData = useDashboardKeuangan(
    useMemo(() => ({
      year,
      cageId: selectedBatchId,
      batchId: selectedBatchId,
    }), [year, selectedCageId])
  );

  const handleCageIdChange = (cageId: string) => {
    setSelectedCageId(cageId); // Simpan cageId di state parent
  };
  
  const handleBatchIdChange = (batchId: string) => {
    setSelectedBatchId(batchId); // Simpan batchId di state parent
  }

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({ 
        queryKey: ["/v1/journal/chart-keuangan"] 
      });
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [queryClient]);

  const formatRupiah = (value: number) => {
    return Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(value);
  }

  const chart = useMemo<{
    series: [{ name: string; data: number[] }, { name: string; data: number[] }, { name: string; data: number[] }];
    options: ApexCharts.ApexOptions;
  }>(() => ({
    series: [
      {
        name: "Asset",
        data: chartData.data?.data?.chart?.map((item) => item.totalAsset) || [],
      },
      {
        name: "Equitas",
        data: chartData.data?.data?.chart?.map((item) => item.totalEquitas) || [],
      },
      {
        name: "Net Profit",
        data: chartData.data?.data?.chart?.map((item) => item.netProfit) || [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
      },
      colors: ["#1B693E", "#F6C344", "#FF5733"],
      markers: {
        size: 6,
        hover: { sizeOffset: 3 },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: chartData.data?.data?.chart?.map((item) => {
          // Buat Date fiktif: year = 1970, month = item.month - 1
          const date = new Date(1970, item.month - 1);
          // Lalu kembalikan nama bulan saja
          return date.toLocaleString("default", { month: "long" });
        }) || [],
      },
      yaxis: {
        title: { text: "Jumlah (Ribuan)" },
        // format
        labels: {
          formatter: (value) => {
            return formatRupiah(value);
          },
        },
      },
      tooltip: {
        theme: "light",
        shared: false,
        intersect: true,
      },
    },
  }), [chartData]);

  return (
        <div>
          <Card>
            <CardBody>
              <div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-3 w-full">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Analytics</h2>
                  <p className="text-lg text-muted-foreground">Keuangan</p>
                </div>

                {/* Wrapper filter dan select agar bisa diatur jadi 1 baris di desktop */}
                <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
                  <FilterCageRack onCageIdChange={handleCageIdChange}/>
                  <FilterBatch disableLabel={true} onBatchIdChange={handleBatchIdChange} className="w-full md:w-[20rem]"/>
                               
                  <div className="w-full md:w-[20rem]">
                    <Select
                      placeholder="Pilih Tahun"
                      variant="bordered"
                      labelPlacement="outside"
                      className="w-full md:w-50 lg:w-60"
                      renderValue={(value) => (
                        <span className="text-black">{
                          value[0].key === "placeholder" ? "Pilih Tahun" : value[0].key
                        }</span>
                      )}
                      onChange={(e) => {
                        setYear(e.target.value);
                      }}
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
                </div>
              </div>
              <div>
                <Chart options={chart.options} series={chart.series} type="line" height={350}/>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Aset
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatRupiah(chartData?.data?.data?.totalAsset ?? 0)
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">IDR</p>
                      {/*<p className="text-xs text-red-500 mt-1">*/}
                      {/*  -23.44%*/}
                      {/*</p>*/}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Kewajiban dan Ekuitas
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatRupiah(chartData?.data?.data?.totalEquitas ?? 0)
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">IDR</p>
                      {/*<div className="flex items-baseline gap-2">*/}
                      {/*  <span className="text-xs text-red-500">-23.44%</span>*/}
                      {/*</div>*/}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Laba Rugi
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatRupiah(chartData?.data?.data?.totalNetProfit ?? 0)
                        }
                      </div>
                      {/*<p className="text-xs text-red-500 mt-1">*/}
                      {/*  -23.44%*/}
                      {/*</p>*/}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
  )
}