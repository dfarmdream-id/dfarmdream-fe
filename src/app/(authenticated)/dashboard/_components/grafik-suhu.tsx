"use client";
import {
  Card,
  CardBody,
  Chip,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ReactNode, useMemo, useState, useEffect } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import dynamic from "next/dynamic";
import {
  useGetRelayLogData,
  useGetTemperatureData,
} from "../../_services/iot-device";
import EmptyState from "@/components/state/empty";
import { useQueryState } from "nuqs";
import { DateTime } from "luxon";
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

export default function GrafikSuhu({
  showTable = false,
}: {
  children: ReactNode;
  showTable: boolean;
}) {
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);
  const { siteId } = useLocationStore();
  const queryClient = useQueryClient();

  const items = useGetTemperatureData(
    useMemo(
      () => ({
        tanggal: tanggal || "",
        cageId: kandang || "",
        siteId: siteId || "",
      }),
      [kandang, tanggal, siteId]
    )
  );

  console.log("Temperature : ", items)

  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.refetchQueries({
        queryKey: ["/v1/sensor/temperature"],
      });
    }, 2 * 60 * 60 * 1000); // 2 hours in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [queryClient]);

  const columns = [
    {
      key: "lokasi",
      label: "Lokasi",
    },
    {
      key: "kandang",
      label: "Kandang",
    },
    {
      key: "tanggal",
      label: "Tanggal",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "relayDesc",
      label: "Deskripsi",
    },
  ];

  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  // const [limit, setLimit] = useQueryState("limit", {
  //   throttleMs: 1000,
  // });
  const limit: string = "5";
  const thresholdLiveSensor = 60 * 1000;

  const relayLogs = useGetRelayLogData(
    useMemo(
      () => ({
        q: "",
        page: page || "1",
        limit: limit || "10",
        tanggal: tanggal || "",
        cageId: kandang || "",
      }),
      [page, limit, tanggal, kandang]
    )
  );

  const rows = useMemo(() => {
    if (relayLogs.data) {
      return relayLogs.data?.data?.data || [];
    }
    return [];
  }, [relayLogs.data]);


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
          data: items?.data?.data?.chart?.map((item) => item.y) ?? [],
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
          categories: items?.data?.data?.chart?.map((item) => {
            return DateTime.fromISO(item.x)
            .setZone("Asia/Jakarta")
            .toFormat("HH:mm");
          }) ?? [],
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
              <p className="text-lg text-muted-foreground">Sensor Suhu</p>
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
              type="area"
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
                    <div>{item.lastestValue}°C</div>
                    <div className="relative w-full">
                      <div
                        className="absolute -translate-y-1/2 -translate-x-1/2 h-4 w-1 bg-green-500 shadow-md rounded"
                        style={{
                          right: `${
                            item.lastestValue <= item?.IotSensor?.tempThreshold
                              ? (item?.lastestValue /
                                  item?.IotSensor?.tempThreshold) *
                                50 // Left of center (Good side)
                              : 50 +
                                ((item?.lastestValue -
                                  item?.IotSensor?.tempThreshold) /
                                  item?.IotSensor?.tempThreshold) *
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

          {showTable && (
            <div className="mt-5">
              <Table aria-label="Data">
                <TableHeader columns={columns}>
                  {(column) => (
                    <TableColumn key={column.key}>{column.label}</TableColumn>
                  )}
                </TableHeader>
                <TableBody
                  items={rows}
                  isLoading={relayLogs.isLoading}
                  loadingContent={<Spinner />}
                  emptyContent={<EmptyState />}
                >
                  {(item) => (
                    <TableRow
                      key={item.id}
                      className="odd:bg-[#75B89F]"
                      role="button"
                    >
                      <TableCell>
                        <div>{item.sensor?.cage?.site?.name}</div>
                      </TableCell>
                      <TableCell>
                        <div>{item.sensor?.cage?.name}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {DateTime.fromISO(item.createdAt).toLocaleString(
                            DateTime.DATETIME_MED_WITH_WEEKDAY,
                            { locale: "id" }
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={item.status === 1 ? "success" : "danger"}
                          className="text-white"
                        >
                          {item.status === 1 ? "Nyala" : "Mati"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div>{item.relayDesc}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-center mt-3">
                <Pagination
                  color="primary"
                  total={relayLogs.data?.data?.meta?.totalPage || 1}
                  initialPage={1}
                  page={relayLogs.data?.data?.meta?.page || 1}
                  onChange={(page) => setPage(page.toString())}
                />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
