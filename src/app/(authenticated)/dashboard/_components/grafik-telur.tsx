"use client"

import {Card, CardBody, CardHeader, Spinner} from "@nextui-org/react";
import {TimePeriodSelector} from "@/app/(authenticated)/dashboard/_components/time-period-selector";
import dynamic from "next/dynamic";
import { useDashboardChartEgg } from "@/app/(authenticated)/_services/dashboard";
import {useMemo, useState} from "react";
import {DateTime} from "luxon";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);
export default function GrafiTelur (){
  const [range, setRange] = useState<string>("days");

  const chartData = useDashboardChartEgg(
    useMemo(() => ({
      groupBy: range,
    }), [range])
  );
  
  // const chartOptions: ApexCharts.ApexOptions = {
  //   chart: {
  //     type: "line",
  //     height: 350,
  //     toolbar: { show: false },
  //   },
  //   colors: ["#1B693E", "#F6C344"],
  //   markers: {
  //     size: 6,
  //     hover: { sizeOffset: 3 },
  //   },
  //   dataLabels: { enabled: false },
  //   stroke: { curve: "smooth", width: 2 },
  //   xaxis: {
  //     categories: [
  //       "1 Oct", "3 Oct", "7 Oct", "10 Oct", "14 Oct", "20 Oct", "23 Oct", "27 Oct", "30 Oct",
  //     ],
  //   },
  //   yaxis: {
  //     title: { text: "Jumlah (Ribuan / Butiran)" },
  //   },
  //   tooltip: {
  //     theme: "light",
  //     shared: false,
  //     intersect: true,
  //   },
  // };

  const parseByRangeAndDate = (range: string, date: any) => {
    const dt = DateTime.fromISO(date); // Konversi date ke Luxon DateTime

    if (!dt.isValid) {
      throw new Error("Invalid date provided");
    }

    switch (range) {
      case "days":
        return dt.toFormat("yyyy-MM-dd"); // Format: 2024-12-17
      case "weeks":
        return `Week ${dt.weekNumber}, ${dt.year}`; // Format: Week 51, 2024
      case "months":
        return dt.toFormat("MMMM yyyy"); // Format: December 2024
      case "years":
        return dt.toFormat("yyyy"); // Format: 2024
      default:
        throw new Error("Invalid range provided, use: days, weeks, months, years");
    }
  };
  
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
        name: "Telur",
        data: chartData.data?.data?.map((item) => item.total) || [],
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
          return parseByRangeAndDate(range, item.date);
        }) || [],
      },
      yaxis: {
        title: { text: "Jumlah (Ribuan / Butiran)" },
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
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Grafik</h2>
                  <p className="text-lg text-muted-foreground">Telur</p>
                </div>
                <div className="flex">
                  <TimePeriodSelector
                    onChange={(value) => setRange(value)}
                    defaultValue={range}
                  />
                </div>
              </div>
              <div>
                <Chart options={chart.options} series={chart.series} type="line" height={350} />
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
                          sumPenjualanTotalButir
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