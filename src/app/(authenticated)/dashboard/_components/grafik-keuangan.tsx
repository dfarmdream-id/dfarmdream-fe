"use client"

import {Card, CardBody, CardHeader, Select, SelectItem, Spinner} from "@nextui-org/react";
import {useMemo, useState} from "react";
import { useDashboardKeuangan} from "@/app/(authenticated)/_services/dashboard";
import dynamic from "next/dynamic";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);

export default function GrafiKeuangan (){
  const [year, setYear] = useState<string | null>(null);

  const chartData = useDashboardKeuangan(
    useMemo(() => ({
      year,
    }), [year])
  );

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
          return new Date(item.month).toLocaleString("default", { month: "long" });
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
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Analytics</h2>
                  <p className="text-lg text-muted-foreground">Keuangan</p>
                </div>
                <div>
                  <div className="flex gap-3" style={{
                    alignItems: "center",
                    width: "30rem",
                  }}>
                    <Select placeholder="Pilih Tahun"
                            variant="bordered"
                            labelPlacement="outside"
                            selectedKeys={[
                              new Date().getFullYear().toString(),
                            ]}
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                    >
                      <SelectItem key="2021" value="2021">2021</SelectItem>
                      <SelectItem key="2022" value="2022">2022</SelectItem>
                      <SelectItem key="2023" value="2023">2023</SelectItem>
                      <SelectItem key="2024" value="2024">2024</SelectItem>
                      <SelectItem key="2025" value="2025">2025</SelectItem>
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