"use client";

import { Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { useMemo, useEffect } from "react";
import { useDashboardChartDisease } from "@/app/(authenticated)/_services/dashboard";
import { useQueryClient } from "@tanstack/react-query";

// Lazy load Chart untuk mendukung SSR
const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);

export default function GrafikDisease({
  date,
                                        cageId
                                      }: {
  date: string | null;
  cageId: string | null;
}) {
  const queryClient = useQueryClient();

  const chartData = useDashboardChartDisease(
    useMemo(() => ({
      date,
      cageId,
    }), [date, cageId])
  );

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({ 
        queryKey: ["/v1/dashboard/chart-disease"] 
      });
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [queryClient]);

  const chart = useMemo<{
    series: [{ name: string; data: number[] }];
    options: ApexCharts.ApexOptions;
  }>(() => ({
    series: [
      {
        name: "Total Kasus Penyakit",
        data: chartData.data?.data?.map((item) => item.total) || [],
      },
    ],
    options: {
      chart: {
        type: "bar", // Gunakan bar chart
        height: 500,
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          horizontal: true, // Membuat bar chart horizontal
          borderRadius: 4, // Memberikan border radius pada bar
          barHeight: "80%", // Ukuran tinggi bar
        },
      },
      xaxis: {
        categories: chartData.data?.data?.map((item) => item.disease) || [],
        title: { text: "Jumlah Kasus" },
      },
      yaxis: {
        title: { text: "Jenis Penyakit" },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        theme: "light",
      },
      colors: ["#4C8BF5"], // Warna biru seperti contoh
    },
  }), [chartData]);

  return (
    <div>
      <Chart options={chart.options} series={chart.series} type="bar" height={500} />
    </div>
  );
}