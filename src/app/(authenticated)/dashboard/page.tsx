"use client";

import {Card, CardBody, CardHeader, DateRangePicker, Select, SelectItem, Spinner} from "@nextui-org/react";
import dynamic from "next/dynamic";
import {ReactNode, useMemo, useState} from "react";
import { HiArchiveBox, HiUserPlus, HiUsers } from "react-icons/hi2";
import { useDashboardChart, useDashboardSummary } from "../_services/dashboard";
import Link from "next/link";
import { Can } from "@/components/acl/can";
import { useGetProfile } from "../_services/profile";
import IotDevices from "./_components/IotDevice";
import TableAbsen from "./_components/table-absen";
import GrafikSuhu from "./_components/grafik-suhu";
import GrafikAmonia from "./_components/grafik-amonia";
import GrafikHumidity from "./_components/grafik-humidity";
import ForbiddenState from "@/components/state/forbidden";
import CctvDevice from "@/app/(authenticated)/dashboard/_components/cctvDevice";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import GrafiTelur from "@/app/(authenticated)/dashboard/_components/grafik-telur";
import GrafikAyam from "@/app/(authenticated)/dashboard/_components/grafik-ayam";
import GrafikDisease from "@/app/(authenticated)/dashboard/_components/grafik-disease";
import GrafiKeuangan from "@/app/(authenticated)/dashboard/_components/grafik-keuangan";
import LogKipasLampu from "./_components/log-kipas-lampu";
import GrafikPersediaanBarang from "./_components/grafik-persediaan-barang";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);

export default function Page() {
  const [chickenDate, setChickenDate] = useState<string | null>(null);
  const [chickenCageChartSelected, setChickenCageChartSelected] = useState<string | null>(null);

  const [performanceCageChartSelected, setPerformanceCageChartSelected] = useState<string | null>(null);
  const [performanceChartDate, setPerformanceChartDate] = useState<string | null>(null);

  const profile = useGetProfile();

  // Memoize dashboard summary data
  const dashboard = useDashboardSummary(
    useMemo(() => ({
      cageId: performanceCageChartSelected,
    }), [performanceCageChartSelected])
  );

  // Memoize chart data
  const chartData = useDashboardChart(
    useMemo(() => ({
      date: chickenDate,
      cageId: chickenCageChartSelected,
    }), [chickenCageChartSelected, chickenDate])
  );

  // Fetch cages data
  const cages = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));

  // Debounced handlers
  // const debouncedSetPerformanceChartDate = useCallback(useDebounce(setPerformanceChartDate, 300), []);

  const StatsCard = ({
                       title,
                       count,
                       icon,
                     }: {
    title: string;
    count: number;
    icon: ReactNode;
  }) => {
    return (
      <Card>
        <CardBody className="flex gap-3 flex-row justify-between items-center">
          <div>
            <div className="text-xl">{title}</div>
            <div className="text-2xl font-semibold">
              {Intl.NumberFormat("id-ID").format(count)}
            </div>
          </div>
          <div className="flex items-center text-3xl bg-primary p-2 aspect-square rounded-lg text-white">
            {icon}
          </div>
        </CardBody>
      </Card>
    );
  };

  // Memoize chart configuration
  const chart = useMemo<{
    series: number[];
    options: ApexCharts.ApexOptions;
  }>(
    () => ({
      series: [
        chartData?.data?.data?.alive || 0,               // Ayam Hidup dan Sehat
        chartData?.data?.data?.dead || 0,                // Ayam Mati Tanpa Penyakit
        chartData?.data?.data?.alive_in_sick || 0,       // Ayam Hidup dengan Penyakit
        chartData?.data?.data?.dead_due_to_illness || 0, // Ayam Mati karena Penyakit
        chartData?.data?.data?.productive || 0,          // Ayam Produktif
        chartData?.data?.data?.feed_change || 0,         // Ayam dalam Proses Ganti Pakan
        chartData?.data?.data?.spent || 0,               // Ayam Tidak Produktif
        chartData?.data?.data?.rejuvenation || 0,        // Ayam dalam Proses Peremajaan
      ],
      options: {
        legend: {
          show: true,
          position: "top",
          markers: {
            shape: "rect",
          },
        },
        plotOptions: {
          pie: {
            donut: {
              size: "50%",
            },
          },
        },
        chart: {
          type: "donut",
        },
        labels: [
          "Ayam Hidup dan Sehat",      // Status hidup sehat
          "Ayam Mati Tanpa Penyakit",  // Status mati tanpa sakit
          "Ayam Hidup dengan Penyakit",// Status hidup namun sakit
          "Ayam Mati karena Penyakit", // Status mati karena sakit
          "Ayam Produktif",            // Ayam dalam masa produktif
          "Ayam dalam Proses Ganti Pakan", // Ayam dalam proses ganti pakan
          "Ayam Tidak Produktif",      // Ayam tidak produktif
          "Ayam dalam Proses Peremajaan", // Ayam dalam proses peremajaan
        ],
        colors: [
          "#0f6646", // Hijau tua untuk "Ayam Hidup dan Sehat"
          "#f3cb52", // Kuning untuk "Ayam Mati Tanpa Penyakit"
          "#f39652", // Oranye untuk "Ayam Hidup dengan Penyakit"
          "#f35252", // Merah untuk "Ayam Mati karena Penyakit"
          "#1b998b", // Hijau terang untuk "Ayam Produktif"
          "#f4a261", // Coklat untuk "Ayam dalam Proses Ganti Pakan"
          "#9d4edd", // Ungu untuk "Ayam Tidak Produktif"
          "#3a86ff", // Biru terang untuk "Ayam dalam Proses Peremajaan"
        ],
      },
    }),
    [chartData]
  );

  return (
    <Can
      action="show:dashboard"
      loader={
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex justify-center flex-col">
            <Spinner />
            <div>Loading...</div>
          </div>
        </div>
      }
      fallback={<ForbiddenState />}
    >
      <div className="p-5 space-y-5">
        <div className="text-3xl font-bold mb-10">Data Peternakan</div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Can action="show:dashboard-stats-investors">
            <Link href="/master/investors">
              <StatsCard
                icon={<HiUserPlus/>}
                title="Investor"
                count={dashboard.data?.data?.investor || 0}
              />
            </Link>
          </Can>
          <Can action="show:dashboard-stats-cages">
            <Link href="/operational/cages">
              <StatsCard
                icon={<HiArchiveBox/>}
                title="Kandang"
                count={dashboard.data?.data?.cage || 0}
              />
            </Link>
          </Can>
          <Can action="show:dashboard-stats-users">
            <Link href="/master/users">
              <StatsCard
                icon={<HiUsers/>}
                title="Karyawan"
                count={dashboard?.data?.data?.user || 0}
              />
            </Link>
          </Can>
        </div>
        <div className="grid lg:grid-cols-2 gap-5">
          <Can action="show:dashboard-chicken-chart">
            <Card>
              <CardHeader className="flex flex-col items-start">
                <div className="font-bold text-xl">Grafik Ayam</div>
                <div>{profile?.data?.data?.site?.name}</div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap md:flex-nowrap gap-3 my-1">
                  <DateRangePicker
                    variant="bordered"
                    onChange={(e) => {
                      setChickenDate(
                        `${e?.start?.toString() || ""},${e?.end?.toString() || ""}`
                      );
                    }}
                  />
                  <Select
                    variant="bordered"
                    placeholder="Pilih kandang"
                    isLoading={cages.isLoading}
                    onChange={(e) => setChickenCageChartSelected(e.target.value)}
                  >
                    {cages.data?.data?.data?.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    )) || []}
                  </Select>
                </div>

                <Chart
                  options={chart.options}
                  series={chart.series}
                  type="donut"
                />
              </CardBody>
            </Card>
          </Can>
          <Can action="show:dashboard-performance-stats">
            <Card>
              <CardHeader className="flex flex-col items-start">
                <div className="font-bold text-xl">Grafik Penyakit Ayam</div>
                <div>{profile.data?.data?.site?.name}</div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap md:flex-nowrap gap-3 my-1">
                  <DateRangePicker variant="bordered"
                                   onChange={
                                     (e) => {
                                       setPerformanceChartDate(`${e?.start?.toString() || ""},${e?.end?.toString() || ""}`);
                                     }
                                   }
                  />
                  <Select
                    variant="bordered"
                    placeholder="Pilih kandang"
                    isLoading={cages.isLoading}
                    onChange={(e) => setPerformanceCageChartSelected(e.target.value)}
                  >
                    {cages.data?.data?.data?.map((site) => (
                      <SelectItem key={site.id} value={site.id}>
                        {site.name}
                      </SelectItem>
                    )) || []}
                  </Select>
                </div>

                <GrafikDisease
                  date={performanceChartDate}
                  cageId={performanceCageChartSelected}
                />
              </CardBody>
            </Card>
          </Can>
        </div>
        <div>
          <Can action="show:chart-keuangan">
            <GrafiKeuangan/>
          </Can>
        </div>
        <div>
          <Can action="show:chart-egg">
            <GrafiTelur/>
          </Can>
        </div>
        <div>
          <Can action="show:chart-egg">
            <GrafikPersediaanBarang/>
          </Can>
        </div>
        <div>
          <Can action="show:chart-chicken">
            <GrafikAyam/>
          </Can>
        </div>
        <Can action="show:temperature-sensors">
          <GrafikSuhu showTable={false}>Suhu Kandang</GrafikSuhu>
        </Can>
        <Can action="show:amonia-sensors">
          <GrafikAmonia>Kadar Amonia</GrafikAmonia>
        </Can>
        <Can action="show:humidity-sensors">
          <GrafikHumidity></GrafikHumidity>
        </Can>
        <Can action="show:humidity-sensors">
          <LogKipasLampu>Log Kipas dan Lampu</LogKipasLampu>
        </Can>
        <Can action="show:light-sensors">
          <IotDevices>Sensor Lampu</IotDevices>
        </Can>
        <Can action="show:cctv-dashboard">
          <CctvDevice/>
        </Can>
        <Can action="show:absences">
          <TableAbsen/>
        </Can>
      </div>
    </Can>
  );
}
