"use client";
import {
  Card,
  CardBody,
  Chip,
  Input,
  Spinner
} from "@nextui-org/react";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import dynamic from "next/dynamic";
import {
  useGetHumidityData,
} from "../../_services/iot-device";
import useLocationStore from "@/stores/useLocationStore";
import { useQueryClient } from "@tanstack/react-query";
import FilterCageRack from "./filterCageRack";

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

export default function GrafikHumidity() {
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);
  const { siteId } = useLocationStore();
  const queryClient = useQueryClient();

  const items = useGetHumidityData(
    useMemo(
      () => ({
        tanggal: tanggal || "",
        cageId: kandang || "",
        siteId: siteId || "",
      }),
      [kandang, tanggal, siteId]
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({
        queryKey: ["/v1/sensor/humidity"],
      });
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [queryClient]);

  const thresholdLiveSensor = 60 * 1000;

  const handleCageIdChange = (cageId: string) => {
    setKandang(cageId); // Simpan cageId di state parent
  };

  const chart = useMemo<{
    series: [{ name: string; data: number[] }];
    options: ApexCharts.ApexOptions;
  }>(
    () => ({
      series: [
        {
          name: "Temperature",
          data: items?.data?.data?.chart?.map((x) => x.y) ?? [],
        },
      ],
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
        height: 350,
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
        xaxis: {
          categories: items?.data?.data?.chart?.map((x) => x.x) ?? [],
        },
      },
    }),
    [items]
  );

  return (
    <div>
      <Card>
        <CardBody>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold">Grafik</h2>
              <p className="text-lg text-muted-foreground">Sensor Humidity/Kelembapan</p>
            </div>
            <div className="flex justify-start items-center md:justify-end w-full md:w-auto gap-3">
              <div className="flex-1">
                <FilterCageRack
                  // onRackIdChange={handleRackIdChange}
                  onCageIdChange={handleCageIdChange}
                />
              </div>
              <div className="flex-1">
                <Input
                  type="date"
                  placeholder="Pilih Tanggal"
                  onChange={(e) => setTanggal(e.target.value)}
                  className="mb-3 mt-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Chart
              type="line"
              options={chart.options}
              series={chart.series}
              height={350}
            />
          </div>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {items?.data?.data?.sensors &&
              items.data.data.sensors.map((item) => (
                <div
                  className="flex gap-3 items-center border-primary border-4 p-3 rounded-md"
                  key={item.code}
                >
                  <div className="w-8 h-8 md:w-16 md:h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
                    <div>
                      <FaTemperatureEmpty className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="w-full flex-1">
                    <div className="font-bold w-full break-words overflow-hidden">
                      Sensor: {item.code}
                    </div>
                    <div>{item.lastestValue}%</div>
                    <div className="relative w-full">
                      <div
                        className="absolute -translate-y-1/2 -translate-x-1/2 h-4 w-1 bg-green-500 shadow-md rounded"
                        style={{
                          right: `${
                            item.lastestValue <= item?.IotSensor?.humidityThreshold
                              ? (item?.lastestValue /
                                  item?.IotSensor?.humidityThreshold) *
                                50 // Left of center (Good side)
                              : 50 +
                                ((item?.lastestValue -
                                  item?.IotSensor?.humidityThreshold) /
                                  item?.IotSensor?.humidityThreshold) *
                                  50 // Right of center (Bad side)
                          }%`,
                          top: "0px",
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
                    {Date.now() - item.lastUpdatedAt > thresholdLiveSensor ? (
                      <Chip color="danger">Mati</Chip>
                    ) : (
                      <Chip color="primary">Hidup</Chip>
                    )}
                  </div>
                </div>
              ))}
          </div>

        
        </CardBody>
      </Card>
    </div>
  );
}
