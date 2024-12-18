"use client";
import {
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { FaTemperatureEmpty } from "react-icons/fa6";
import { useGetCages } from "../../_services/cage";
import dynamic from "next/dynamic";
import {
  useGetRelayLogData,
  useGetTemperatureData,
} from "../../_services/iot-device";
import EmptyState from "@/components/state/empty";
import { useQueryState } from "nuqs";
import { DateTime } from 'luxon'

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

export default function GrafikSuhu({ children }: { children: ReactNode }) {
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);

  const items = useGetTemperatureData(
    useMemo(
      () => ({
        tanggal: tanggal || "",
        cageId: kandang || "",
      }),
      [kandang, tanggal]
    )
  );

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

  const relayLogs = useGetRelayLogData(
    useMemo(
      () => ({
        q: "", page: page || "1", limit: limit || "10", tanggal: tanggal || "",
        cageId: kandang || ""
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

  const cages = useGetCages(
    useMemo(() => ({ page: "1", limit: "100",  }), [])
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
            name: "Temperature",
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
        xaxis: {
          categories: items?.data?.data?.chart?.map((x) => x.x) ?? [],
        },
      },
    };
  }, [items]);

  return (
    <div className="bg-white rounded-lg p-5 gap-3">
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
        <div className="w-full overflow-hidden space-y-3 mt-5">
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
          <ul className="space-y-5 py-5 mt-5">
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
                               ? (item?.lastestValue / item?.IotSensor?.tempThreshold) * 50 // Left of center (Good side)
                               : 50 + ((item?.lastestValue - item?.IotSensor?.tempThreshold) / item?.IotSensor?.tempThreshold) * 50 // Right of center (Bad side)
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
                    {item.lastestValue ? (
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
                  <div>{DateTime.fromISO(item.createdAt).toLocaleString(
                    DateTime.DATETIME_MED_WITH_WEEKDAY,
                    { locale: "id" }
                  )}</div>
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
    </div>
  );
}