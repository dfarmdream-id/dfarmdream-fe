"use client";

import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { ReactNode, useMemo } from "react";
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
import { FaChartPie, FaEgg, FaWeight } from "react-icons/fa";
import { GiNestEggs } from "react-icons/gi";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);

export default function Page() {
  const dashboard = useDashboardSummary();
  const chartData = useDashboardChart();
  const profile = useGetProfile();

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

  const chart = useMemo<{
    series: number[];
    options: ApexCharts.ApexOptions;
  }>(() => {
    return {
      series: [
        chartData?.data?.data?.alive || 0,
        chartData?.data?.data?.dead || 0,
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
        labels: ["Ayam Hidup", "Ayam Mati"],
        colors: ["#0f6646", "#f3cb52", "#f3cb52"],
        responsive: [],
      },
    };
  }, [chartData]);

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
                icon={<HiUserPlus />}
                title="Investor"
                count={dashboard.data?.data?.investor || 0}
              />
            </Link>
          </Can>
          <Can action="show:dashboard-stats-cages">
            <Link href="/operational/cages">
              <StatsCard
                icon={<HiArchiveBox />}
                title="Kandang"
                count={dashboard.data?.data?.cage || 0}
              />
            </Link>
          </Can>
          <Can action="show:dashboard-stats-users">
            <Link href="/master/users">
              <StatsCard
                icon={<HiUsers />}
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
                <div className="font-bold text-xl">Grafik Performa</div>
                <div>{profile.data?.data?.site?.name}</div>
              </CardHeader>
              <CardBody>
                <ul className="grid xl:grid-cols-2 gap-3">
                  <Card as="li" shadow="none">
                    <StatsCard
                      icon={<FaEgg />}
                      title="Berat Telur"
                      count={dashboard.data?.data?.weightTotal || 0}
                    />
                  </Card>
                  <Card as="li" shadow="none">
                    <StatsCard icon={<FaChartPie />} title="FCR" count={1} />
                  </Card>
                  <Card as="li" shadow="none">
                    <StatsCard
                      icon={<FaWeight />}
                      title="Berat Keseluruhan"
                      count={dashboard.data?.data?.weightTotal || 0}
                    />
                  </Card>
                  <Card as="li" shadow="none">
                    <StatsCard
                      icon={<GiNestEggs />}
                      title="Total Telur"
                      count={dashboard.data?.data?.qtyTotal || 0}
                    />
                  </Card>
                </ul>
              </CardBody>
            </Card>
          </Can>
        </div>
        <Can action="show:temperature-sensors">
          <GrafikSuhu>Suhu Kandang</GrafikSuhu>
        </Can>
        <Can action="show:amonia-sensors">
          <GrafikAmonia>Kadar Amonia</GrafikAmonia>
        </Can>
        <Can action="show:humidity-sensors">
          <GrafikHumidity>Kadar Kelembapan</GrafikHumidity>
        </Can>
        <Can action="show:light-sensors">
          <IotDevices>Sensor Lampu</IotDevices>
        </Can>
        <Can action="show:absences">
          <TableAbsen />
        </Can>
      </div>
    </Can>
  );
}
