"use client"

import {Card, CardBody, CardHeader, Spinner} from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useDashboardChartEgg } from "@/app/(authenticated)/_services/dashboard";
import {useMemo, useState, useEffect} from "react";
import {DateTime} from "luxon";
import FilterCageRack from "@/app/(authenticated)/dashboard/_components/filterCageRack";
import { useQueryClient } from "@tanstack/react-query";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import {DateRangeSelector} from "@/app/(authenticated)/dashboard/_components/DateRangeSelector";
import {formatNumber} from "@/libs/helper";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);
export default function GrafiTelur (){
  const [selectedCageId, setSelectedCageId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const handleRangeChange = (range: { startDate: Date | null; endDate: Date | null }) => {
    setSelectedRange(range);
  };
  
  const selectedRackId = null;
  const queryClient = useQueryClient();

  // const handleRackIdChange = (rackId: string) => {
  //   setSelectedRackId(rackId); // Simpan rackId di state parent
  // };

  const handleCageIdChange = (cageId: string) => {
    setSelectedCageId(cageId); // Simpan cageId di state parent
  };

  const handleBatchIdChange = (batchId: string) => {
    setSelectedBatchId(batchId); // Simpan batchId di state parent
  }

  const chartData = useDashboardChartEgg(
    useMemo(
      () => ({
        groupBy: "days",
        rackId: selectedRackId,
        cageId: selectedCageId,
        batchId: selectedBatchId,
        dateRange: selectedRange,
      }),
      [selectedRange, selectedRackId, selectedCageId, selectedBatchId] // Memastikan dependensi sesuai
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({ 
        queryKey: ["/v1/dashboard/chart-egg"] 
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
    series: [{ name: string; data: number[] }, { name: string; data: number[] }];
    options: ApexCharts.ApexOptions;
  }>(() => ({
    series: [
      {
        name: "Harga Telur",
        data: chartData.data?.data?.map((item) => item.totalHarga) || [],
      },
      {
        name: "Biaya Operasional",
        data: chartData.data?.data?.map((item) => item.totalBiaya) || [],
      },
    ],
    options: {
      chart: {
        type: "line",
        height: 350,
        toolbar: { show: false },
      },
      colors: ["#1B693E", "#F6C344"],
      markers: {
        size: 6,
        hover: { sizeOffset: 3 },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      xaxis: {
        categories: chartData.data?.data?.map((item) => {
          const dt = DateTime.fromISO(item.date);

          if (!dt.isValid) {
            throw new Error("Invalid date provided");
          }

          return dt.toFormat("dd-MM-yyyy");
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

  const sumPenjualanTotal = useMemo(() => {
    return chartData.data?.data?.reduce((acc, item) => acc + (item.totalHarga || 0), 0) ?? 0;
  }, [chartData]);

  const sumMarginKotor = useMemo(() => {
    return chartData.data?.data?.reduce((acc, item) => acc + (item.totalBiaya || 0), 0) ?? 0;
  }, [chartData]);

  const sumPenjualanTotalButir = useMemo(() => {
    return chartData.data?.data?.reduce((acc, item) => acc + (item.total || 0), 0) ?? 0;
  }, [chartData]);

  return (
        <div>
          <Card>
            <CardBody>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Grafik</h2>
                  <p className="text-lg text-muted-foreground">Telur</p>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
                  <FilterBatch disableLabel={true} onBatchIdChange={handleBatchIdChange} className="w-full md:w-[20rem]"/>
                  <FilterCageRack 
                    // onRackIdChange={handleRackIdChange} 
                    onCageIdChange={handleCageIdChange} />
                  <DateRangeSelector
                    onChange={handleRangeChange}
                  />
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
                        Jumlah Penjualan Total
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatRupiah(sumPenjualanTotal)
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
                        Total Margin Kotor
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">{
                        formatRupiah(sumMarginKotor) 
                      }</div>
                      <p className="text-xs text-muted-foreground mt-1">IDR</p>
                      {/*<div className="flex items-baseline gap-2">*/}
                      {/*  <span className="text-xs text-red-500">-23.44%</span>*/}
                      {/*</div>*/}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Jumlah Penjualan Total
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatNumber(sumPenjualanTotalButir)
                        } Butir
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