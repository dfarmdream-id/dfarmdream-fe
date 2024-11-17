"use client";

import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { ReactNode, useMemo } from "react";
import { HiArchiveBox, HiUserPlus, HiUsers } from "react-icons/hi2";
import { useDashboardChart, useDashboardSummary } from "../_services/dashboard";
import Link from "next/link";
import { useGetProfile } from "../_services/profile";

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
        <CardBody className="flex gap-3 flex-row">
          <div className="flex items-center text-3xl bg-default-50 p-5 aspect-square rounded-lg text-primary">
            {icon}{" "}
          </div>
          <div>
            <div className="text-xl">{title}</div>
            <div className="text-2xl font-semibold">{count}</div>
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
        0,
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
        labels: ["Ayam Hidup", "Ayam Mati", "Ayam Afkir"],
        colors: ["#0f6646", "#f3cb52", "#f3cb52"],
        responsive: [],
      },
    };
  }, [chartData]);

  return (
    <div className="p-5 space-y-5">
      <div className="text-3xl font-bold mb-10">Data Peternakan</div>
      <Card>
        <CardBody className="grid md:grid-cols-3 gap-3">
          <Link href="/master/investor">
            <StatsCard
              icon={<HiUserPlus />}
              title="Investor"
              count={dashboard.data?.data?.investor || 0}
            />
          </Link>
          <Link href="/master/cages">
            <StatsCard
              icon={<HiArchiveBox />}
              title="Kandang"
              count={dashboard.data?.data?.cage || 0}
            />
          </Link>
          <Link href="/master/users">
            <StatsCard
              icon={<HiUsers />}
              title="Karyawan"
              count={dashboard?.data?.data?.user || 0}
            />
          </Link>
        </CardBody>
      </Card>
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex flex-col items-start">
            <div className="font-bold text-xl">Grafik Ayam</div>
            <div>{profile?.data?.data?.sites?.at(0)?.site?.name}</div>
          </CardHeader>
          <CardBody>
            <Chart options={chart.options} series={chart.series} type="donut" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="flex flex-col items-start">
            <div className="font-bold text-xl">Grafik Performa</div>
            <div>{profile.data?.data?.site?.name}</div>
          </CardHeader>
          <CardBody>
            <ul className="grid xl:grid-cols-2 gap-3">
              <Card as="li" shadow="none">
                <StatsCard icon={<HiUsers />} title="Berat Telur" count={1} />
              </Card>
              <Card as="li" shadow="none">
                <StatsCard icon={<HiUsers />} title="FCR" count={1} />
              </Card>
              <Card as="li" shadow="none">
                <StatsCard
                  icon={<HiUsers />}
                  title="Berat Keseluruhan"
                  count={1}
                />
              </Card>
              <Card as="li" shadow="none">
                <StatsCard icon={<HiUsers />} title="Total Telur" count={1} />
              </Card>
            </ul>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
