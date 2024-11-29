"use client";
import { Chip, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import { useGetCages } from "../../_services/cage";
import { useGetSites } from "../../_services/site";
import dynamic from "next/dynamic";
import { useGetAmoniaData } from "../../_services/iot-device";

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

export default function GrafikAmonia({ children }: { children: ReactNode }) {
  const [lokasi, setLokasi] = useState<string | null>(null);
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);

  const items = useGetAmoniaData(
    useMemo(
      () => ({
        tanggal: tanggal || "",
        siteId: lokasi || "",
        cageId: kandang || "",
      }),
      [lokasi, kandang, tanggal]
    )
  );

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
            name: "Ammonia",
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
          categories: items?.data?.data?.chart?.map((x) => `${x.x} ppm`) ?? [],
        },
      },
    };
  }, [items]);

  return (
    <div className="grid md:grid-cols-2 bg-white rounded-lg p-5 gap-3">
      <div className="flex flex-col gap-3 w-full overflow-hidden">
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
      <div>
        <div className="grid md:grid-cols-2 gap-3">
          <Select
            isLoading={sites.isLoading}
            variant="bordered"
            placeholder="Pilih lokasi"
            onChange={(e) => setLokasi(e.target.value)}
          >
            {sites.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
          <Select
            isLoading={cages.isLoading}
            variant="bordered"
            placeholder="Pilih kandang"
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
                className="flex gap-3 items-center border-primary border-4 p-3 rounded-md flex-wrap"
                key={item.code}
              >
                <div className="w-8 h-8 md:w-16 md:h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
                  <div>
                    <FaTemperatureEmpty className="w-5 h-5 md:w-8 md:h-8" />
                  </div>
                </div>
                <div className="w-full flex-1">
                  <div className="font-bold w-full break-words overflow-hidden">Sensor: {item.name}</div>
                  <div>
                    {item.currentAmonia ? item.currentAmonia.toFixed(2) : "-"}{" "}
                    PPM
                  </div>
                  <div>
                    <div className="w-full h-2 rounded-lg bg-gradient-to-r from-danger via-warning to-success"></div>
                    <div className="flex justify-between">
                      <div>Bad</div>
                      <div>Good</div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  {item.currentTemperature ? (
                    <Chip color="primary">Hidup</Chip>
                  ) : (
                    <Chip color="danger">Mati</Chip>
                  )}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
