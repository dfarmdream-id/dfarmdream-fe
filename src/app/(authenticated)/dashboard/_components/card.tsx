"use client";
import { Chip, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ReactNode, useMemo } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import { useGetCages } from "../../_services/cage";
import { useGetSites } from "../../_services/site";
import dynamic from "next/dynamic";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex justify-center items-center p-5">
        <Spinner />
      </div>
    ),
  }
);

export default function DashboardCard({ children }: { children: ReactNode }) {
  const sites = useGetSites(
    useMemo(() => {
      return {
        page: "1",
        limit: "100",
      };
    }, [])
  );

  const cages = useGetCages(
    useMemo(() => {
      return {
        page: "1",
        limit: "100",
      };
    }, [])
  );

  const cageTempChart = useMemo<{
    options: ApexCharts.ApexOptions;
  }>(() => {
    return {
      options: {
        legend: {
          show: true,
          position: "top",
          markers: {
            shape: "rect",
          },
        },
        chart: {
          type: "area",
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          {
            name: "Series 1",
            data: [45, 52, 38, 45, 19, 23, 2],
          },
        ],
        fill: {
          type: "gradient",
          colors: ["#0A6846", "#0A6846"],
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            stops: [0, 90, 100],
          },
        },
        responsive: [],
        xaxis: {
          categories: [
            "00.00",
            "01.00",
            "02.00",
            "03.00",
            "04.00",
            "05.00",
            "06.00",
            "07.00",
            "08.00",
            "09.00",
            "10.00",
            "11.00",
            "12.00",
            "13.00",
            "14.00",
            "15.00",
            "16.00",
            "17.00",
            "18.00",
            "19.00",
            "20.00",
            "21.00",
          ],
        },
      },
    };
  }, []);

  return (
    <div className="grid md:grid-cols-2 bg-white rounded-lg p-5 gap-3">
      <div className="flex flex-col gap-3 w-full">
        <div>
          <div className="text-xl text-primary font-bold text-center">
            {children}
          </div>
          <Chart
            type="area"
            options={cageTempChart.options}
            series={cageTempChart.options.series}
          />
        </div>
        <Select placeholder="Pilih waktu" variant="bordered" className="w-full">
          <SelectItem key="1">1 Jam terakhir</SelectItem>
          <SelectItem key="2">2 Jam terakhir</SelectItem>
          <SelectItem key="3">3 Jam terakhir</SelectItem>
          <SelectItem key="4">4 Jam terakhir</SelectItem>
        </Select>
      </div>
      <div>
        <div className="grid md:grid-cols-2 gap-3">
          <Select variant="bordered" placeholder="Pilih lokasi">
            {sites.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
          <Select variant="bordered" placeholder="Pilih kandang">
            {cages.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
        </div>
        <ul className="space-y-5 py-5">
          <li className="flex gap-3 items-center border-primary border-4 p-3 rounded-md">
            <div className="w-16 h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
              <div>
                <FaTemperatureEmpty className="w-8 h-8" />
              </div>
            </div>
            <div className="w-full">
              <div className="font-bold">Sensor 1</div>
              <div>14.4ppm</div>
              <div>
                <div className="w-full h-2 rounded-lg bg-gradient-to-r from-danger via-warning to-success"></div>
                <div className="flex justify-between">
                  <div>Bad</div>
                  <div>Good</div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Chip color="primary">Hidup</Chip>
            </div>
          </li>
          <li className="flex gap-3 items-center border-primary border-4 p-3 rounded-md">
            <div className="w-16 h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
              <div>
                <FaTemperatureEmpty className="w-8 h-8" />
              </div>
            </div>
            <div className="w-full">
              <div className="font-bold">Sensor 1</div>
              <div>14.4ppm</div>
              <div>
                <div className="w-full h-2 rounded-lg bg-gradient-to-r from-danger via-warning to-success"></div>
                <div className="flex justify-between">
                  <div>Bad</div>
                  <div>Good</div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Chip color="primary">Hidup</Chip>
            </div>
          </li>
          <li className="flex gap-3 items-center border-primary border-4 p-3 rounded-md">
            <div className="w-16 h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
              <div>
                <FaTemperatureEmpty className="w-8 h-8" />
              </div>
            </div>
            <div className="w-full">
              <div className="font-bold">Sensor 1</div>
              <div>14.4ppm</div>
              <div>
                <div className="w-full h-2 rounded-lg bg-gradient-to-r from-danger via-warning to-success"></div>
                <div className="flex justify-between">
                  <div>Bad</div>
                  <div>Good</div>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Chip color="primary">Hidup</Chip>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
