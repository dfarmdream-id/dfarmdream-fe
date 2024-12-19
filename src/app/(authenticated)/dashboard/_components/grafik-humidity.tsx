"use client";
import { Chip, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import { useGetCages } from "../../_services/cage";
import dynamic from "next/dynamic";
import { useGetHumidityData } from "../../_services/iot-device";

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

export default function GrafikHumidity({ children }: { children: ReactNode }) {
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);
  const thresholdLiveSensor = 60 * 1000;

  const items = useGetHumidityData(
    useMemo(
      () => ({
        tanggal: tanggal || "",
        cageId: kandang || "",
      }),
      [kandang, tanggal]
    )
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
          position: "top" as const,
          markers: {
            shape: "rect" as const,
          },
        },
        chart: {
          type: "area" as const,
        },
        dataLabels: {
          enabled: false,
        },
        series: [
          {
            name: "Humidity",
            data: items?.data?.data?.chart?.map((x) => x.y) ?? [],
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
          categories: items?.data?.data?.chart?.map((x) => `${x.x}`) ?? [],
        },
      },
    };
  }, [items]);

  return (
    <div className="grid lg:grid-cols-2 bg-white rounded-lg p-5 gap-3">
      <div className="flex flex-col gap-3 w-full overflow-hidden space-y-5">
        <div className="w-full">
          <div className="text-xl text-primary font-bold text-center">
            {children}
          </div>
          <Chart
            width="100%"
            type="area"
            options={cageTempChart.options}
            series={cageTempChart.options.series}
          />
        </div>
        <Input
          type="date"
          placeholder="Pilih Tanggal"
          onChange={(e) => setTanggal(e.target.value)}
        />
        {/* <Select placeholder="Pilih " variant="bordered" className="w-full">
          <SelectItem key="1">1 Jam terakhir</SelectItem>
          <SelectItem key="2">2 Jam terakhir</SelectItem>
          <SelectItem key="3">3 Jam terakhir</SelectItem>
          <SelectItem key="4">4 Jam terakhir</SelectItem>
        </Select> */}
      </div>
      <div className="mt-5">  
        <div className="grid gap-3">
          <Select
            variant="bordered"
            placeholder="Pilih kandang"
            isLoading={cages.isLoading}
            onChange={(e) => setKandang(e.target.value)}
          >
            {cages.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
        </div>
        <ul className="space-y-5 py-5 w-full">
          {items?.data?.data?.sensors &&
            items.data.data.sensors.map((item) => (
              <li
                className="flex gap-3 items-center border-primary border-4 p-3 rounded-md"
                key={item.code}
              >
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
                  <div>
                    <FaTemperatureEmpty className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                </div>
                <div className="w-full">
                  <div className="font-bold w-full break-words overflow-hidden">Sensor: {item.code}</div>
                  <div>{item.lastestValue}%</div>
                  <div className="relative w-full">
                                       <div
                       className="absolute -translate-y-1/2 -translate-x-1/2 h-4 w-1 bg-green-500 shadow-md rounded"
                       style={{
                         right: `${
                           item?.lastestValue <= item?.IotSensor?.humidityThreshold
                             ? (item?.lastestValue / item?.IotSensor?.humidityThreshold) * 50 // Left of center (Good side)
                             : 50 + ((item?.lastestValue - item?.IotSensor?.humidityThreshold) / item?.IotSensor?.humidityThreshold) * 50 // Right of center (Bad side)
                         }%`,
                         top: '0px'
                       }}
                     ></div>
                    <div className="w-full h-2 rounded-lg bg-gradient-to-r from-danger via-warning to-success"></div>
                    <div className="flex justify-between">
                      <div>Bad</div>
                      <div>Good</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {(Date.now() - item.lastUpdatedAt) > thresholdLiveSensor ? (
                    <Chip color="danger">Mati</Chip>
                  ) : (
                    <Chip color="primary">Hidup</Chip>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}