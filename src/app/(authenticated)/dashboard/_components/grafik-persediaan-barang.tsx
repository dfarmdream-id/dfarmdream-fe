"use client";

import { Card, CardBody, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import {
  useDashboardChartEgg,
  useGetDashboardPersediaanBarang,
} from "@/app/(authenticated)/_services/dashboard";
import { useMemo, useState } from "react";
import FilterCageRack from "@/app/(authenticated)/dashboard/_components/filterCageRack";
import { useQueryClient } from "@tanstack/react-query";
import { DateRangeSelector } from "@/app/(authenticated)/dashboard/_components/DateRangeSelector";
import { NumberFormat } from "@/common/helpers/number-format";
import KartuStokTable from "../../stock/transaksi/components/DataTable";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);
export default function GrafikPersediaanBarang() {
  const [selectedCageId, setSelectedCageId] = useState<string | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });

  const handleRangeChange = (range: {
    startDate: Date | null;
    endDate: Date | null;
  }) => {
    setSelectedRange(range);
  };

  const selectedRackId = null;

  const handleCageIdChange = (cageId: string) => {
    setSelectedCageId(cageId); // Simpan cageId di state parent
  };

  const handleBatchIdChange = (batchId: string) => {
    setSelectedBatchId(batchId); // Simpan batchId di state parent
  };

  const persediaanData = useGetDashboardPersediaanBarang(
    useMemo(
      () => ({
        tanggal: selectedRange,
        cageId: selectedCageId,
      }),
      [selectedRange, selectedCageId]
    )
  );

  const datas = useMemo(() => {
    if (persediaanData.data) {
        const data = persediaanData.data?.data
        const categories = data.map((x)=>x.goods?.name)
        const series = data.map((x)=>x.qty)
        
      return {
        categories: categories,
        series:series
      }
    }
    return {
        categories:null,
        series:null
    }
  }, [persediaanData.data]);

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

  const chart = useMemo<{
    series: [
      { name: string; data: number[] },
    ];
    options: ApexCharts.ApexOptions;
  }>(
    () => ({
      series: [
        {
          name: "Qty Barang",
          data: datas.series || []
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
          toolbar: { show: false },
        },
        xaxis: {
          categories:datas.categories||[],
          labels:{
            show:false
          }
        },
        plotOptions: {
            bar: {
              columnWidth: '45%',
              distributed: true,
            }
          },
          dataLabels: {
            enabled: false
          },
        yaxis: {
          title: { text: "Jumlah (Qty)" },
          // format
          labels: {
            formatter: (value) => {
              return NumberFormat(value)
            },
          },
        },
        colors: datas ? ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#E67E22'] : [],
      },
    }),
    [chartData]
  );

  

  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Grafik</h2>
              <p className="text-lg text-muted-foreground">Persediaan Barang</p>
            </div>
            <div className="flex flex-col md:flex-row items-end md:items-center gap-3 w-full md:w-auto">
              <FilterCageRack
                // onRackIdChange={handleRackIdChange}
                onCageIdChange={handleCageIdChange}
              />
              <DateRangeSelector onChange={handleRangeChange} />
            </div>
          </div>
          <div>
            <Chart
              options={chart.options}
              series={chart.series}
              type="bar"
              height={400}
            />
          </div>
          <div className="mt-2">
            <KartuStokTable/>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
