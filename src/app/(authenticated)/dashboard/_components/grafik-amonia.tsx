"use client";
import { Chip, DateRangePicker, Input, Pagination, Select, SelectItem, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import { useGetCages } from "../../_services/cage";
import dynamic from "next/dynamic";
import { useGetAmoniaData } from "../../_services/iot-device";
import useLocationStore from "@/stores/useLocationStore";
import { useQueryClient } from "@tanstack/react-query";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { useGetTelegramLog } from "../../_services/telegram-log";
import { useQueryState } from "nuqs";
import SkeletonPagination from "@/components/ui/SkeletonPagination";
 
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
  const columns = [
    {
      key: "identityId",
      label: "NIK",
    },
    {
      key: "fullName",
      label: "Nama Pegawai",
    },
    {
      key: "kandang",
      label: "Kandang",
    },
    {
      key: "lokasi",
      label: "Lokasi",
    },
    {
      key:"SendAT",
      label:"Tanggal Pesan Terkirim"
    },
  ];
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);
  const thresholdLiveSensor = 60 * 1000;
  const {siteId} = useLocationStore();
  const queryClient = useQueryClient();


  const items = useGetAmoniaData(
    useMemo(
      () => ({
        tanggal: tanggal || "",
        cageId: kandang || "",
        siteId: siteId || ""
      }),
      [kandang, tanggal, siteId]
    )
  );

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({ 
        queryKey: ["/v1/sensor/amonia"] 
      });
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [queryClient]);

  const [dateRange, setDateRange] = useState<string | null>(null);
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  // const [limit, setLimit] = useQueryState("limit", {
  //   throttleMs: 1000,
  // });
  const limit: string = "5";

  const iot = useGetTelegramLog(
      useMemo(
        () => ({ search: "", page: page || "1", limit: limit || "10", tanggal: dateRange || "", kandang: kandang || "", lokasi:siteId || "" }),
        [page, limit, dateRange, kandang, siteId]
      )
    );
  
    const rows = useMemo(() => {
      if (iot.data) {
        return iot.data?.data?.data || [];
      }
      return [];
    }, [iot.data]);

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
          categories: items?.data?.data?.chart?.map((x) => `${x.x}`) ?? [],
        },
      },
    };
  }, [items]);

  return (
    <div className="bg-white rounded-lg p-5 gap-3">
      <div className="grid lg:grid-cols-2 bg-white rounded-lg p-5 gap-3">
        <div className="flex flex-col gap-3 w-full overflow-hidden">
          <div className="w-full">
            <div className="text-xl text-primary font-bold text-center">
              {children}
            </div>
            <Input
              type="date"
              placeholder="Pilih Tanggal"
              onChange={(e) => setTanggal(e.target.value)}
              className="mb-3 mt-1"
            />
            <Chart
              width="100%"
              type="area"
              options={cageTempChart.options}
              series={cageTempChart.options.series}
            />
          </div>
          {/* <Select placeholder="Pilih " variant="bordered" className="w-full">
            <SelectItem key="1">1 Jam terakhir</SelectItem>
            <SelectItem key="2">2 Jam terakhir</SelectItem>
            <SelectItem key="3">3 Jam terakhir</SelectItem>
            <SelectItem key="4">4 Jam terakhir</SelectItem>
          </Select> */}
        </div>
        <div>
          <div className="grid gap-3">
            <Select
              className="mt-8"
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
                    <div>{item.lastestValue ? item.lastestValue.toFixed(2) : '-'} ppm</div>
                    <div className="relative w-full">
                                      <div
                      className="absolute -translate-y-1/2 -translate-x-1/2 h-4 w-1 bg-green-500 shadow-md rounded"
                      style={{
                        right: `${
                          item?.lastestValue <= item?.IotSensor?.amoniaThreshold
                            ? (item?.lastestValue / item?.IotSensor?.amoniaThreshold) * 50 // Left of center (Good side)
                            : 50 + ((item?.lastestValue - item?.IotSensor?.amoniaThreshold) / item?.IotSensor?.amoniaThreshold) * 50 // Right of center (Bad side)
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
      <div className="mt-5">
      <div className="flex justify-between items-center gap-3 flex-wrap mb-3">
        <div className="flex w-full">
          <div className="text-xl text-primary font-bold text-center">Telegram Log</div>
        </div>
        <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <DateRangePicker variant="bordered"
              onChange={
                (e) => {
                  setDateRange(`${e?.start?.toString() || ""},${e?.end?.toString() || ""}`);
                }
              }
            />
          </div>
        </div>
        <Table aria-label="Data">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={iot.isLoading}
            loadingContent={<Spinner />}
            emptyContent={<EmptyState />}
          >
            {(item) => (
              <TableRow
                key={`${item.identityId}-${item.createdAt}`}
                className="odd:bg-[#cffdec]"
                role="button"
              >
                <TableCell>
                  <div>{item.user.identityId}</div>
                </TableCell>
                <TableCell>
                  <div>{item.user.fullName}</div>
                </TableCell>
                <TableCell>
                  <div>{item.sensor.cage.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.sensor.cage.site.name}</div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.createdAt).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center mt-3">
          {iot.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
              color="primary"
              total={iot.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={iot.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}