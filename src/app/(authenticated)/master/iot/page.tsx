"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Input,
  Chip,
  Spinner,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { useGetIotDevices } from "../_services/iot-device";

const columns = [
  {
    key: "sensorId",
    label: "ID Sensor",
  },
  {
    key: "cageId",
    label: "Kandang",
  },
  {
    key: "tempTreshold",
    label: "Temp Threshold",
  },
  {
    key: "humidityThreshold",
    label: "Humidity Threshold",
  },
  {
    key: "amoniaThreshold",
    label: "Amonia Threshold",
  },
  {
    key: "action",
    label: "Aksi",
  },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q", {
    throttleMs: 1000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });

  const iot = useGetIotDevices(
    useMemo(() => ({ q: search || "", page: page || "1" }), [search, page])
  );

  const rows = useMemo(() => {
    if (iot.data) {
      return iot.data?.data?.data || [];
    }
    return [];
  }, [iot.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Perangkat IOT</div>
      <div className="space-y-5">
        <div className="flex justify-between items-center gap-3">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Perangkat"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/master/iot/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah Perangkat
          </Button>
        </div>
        <Table aria-label="Example table with dynamic content">
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
                key={item.id}
                className="hover:bg-gray-100"
                role="button"
              >
                <TableCell>
                  <div>{item.code}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.cage?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.tempThreshold}°</div>
                </TableCell>
                <TableCell>
                  <div>{item.humidityThreshold}</div>
                </TableCell>
                <TableCell>
                  <div>{item.amoniaThreshold} PPM</div>
                </TableCell>
                <TableCell>
                  <Actions id={item.id} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-center">
          <Pagination
            color="primary"
            total={iot.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={iot.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
