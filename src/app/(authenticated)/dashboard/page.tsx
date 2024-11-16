"use client";

import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import dynamic from "next/dynamic";
import { ReactNode, useMemo } from "react";
import { HiUsers } from "react-icons/hi2";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);

export default function Page() {
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
      <div className="flex gap-3">
        <div className="flex items-center text-3xl bg-default-50 p-5 aspect-square rounded-lg text-primary">
          {icon}{" "}
        </div>
        <div>
          <div className="text-xl">{title}</div>
          <div className="text-2xl font-semibold">{count}</div>
        </div>
      </div>
    );
  };

  const chart = useMemo<{
    series: number[];
    options: ApexCharts.ApexOptions;
  }>(() => {
    return {
      series: [44, 55, 13],
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
  }, []);

  return (
    <div className="p-5 space-y-5">
      <div className="text-3xl font-bold mb-10">Data Peternakan</div>
      <Card>
        <CardBody className="grid md:grid-cols-3">
          <StatsCard icon={<HiUsers />} title="Investor" count={1} />
          <StatsCard icon={<HiUsers />} title="Kandang" count={1} />
          <StatsCard icon={<HiUsers />} title="Karyawan" count={1} />
        </CardBody>
      </Card>
      <div className="grid md:grid-cols-2 gap-5">
        <Card>
          <CardHeader className="flex flex-col items-start">
            <div className="font-bold text-xl">Grafik Ayam</div>
            <div>Majalengka</div>
          </CardHeader>
          <CardBody>
            <Chart options={chart.options} series={chart.series} type="donut" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader className="flex flex-col items-start">
            <div className="font-bold text-xl">Grafik Performa</div>
            <div>Majalengka</div>
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
