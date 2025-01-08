"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  DateRangePicker,
} from "@nextui-org/react";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { useParams } from "next/navigation";
import { useGetLogSensorList } from "@/app/(authenticated)/_services/sensor-device";

const columns = [
  {
    key: "sensorId",
    label: "Sensor",
  },
  {
    key: "type",
    label: "Tipe",
  },
  {
    key: "interval",
    label: "Waktu",
  },

  {
    key: "averageValue",
    label: "Value",
  },
];

export default function Page() {
  
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });
 
  const [tanggal, setTanggal] = useState<string | null>(null);
  

  const params = useParams();
  
  const items = useGetLogSensorList(
    useMemo(
      () => ({
        q: "",
        page: page || "1",
        limit: limit || "10",
        date: tanggal || "",
        sensorId: params.id! as string || "",
      }),
      [ page, limit, params.id, tanggal]
    )
  );

 
  const rows = useMemo(() => {
    if (items.data) {
      return items.data?.data?.data || [];
    }
    return [];
  }, [items.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Log Sensor </div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="w-full md:w-fit flex gap-3">
            <DateRangePicker variant="bordered"
              onChange={
                (e) => {
                  setTanggal(`${e?.start?.toString() || ""},${e?.end?.toString() || ""}`);
                }
              }
            /> 
            </div>
          </div>
        </div>
      

      <div className="space-y-5 bg-white p-5 rounded-lg">
        <Table aria-label="Data">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={items.isLoading}
            loadingContent={<Spinner />}
            emptyContent={<EmptyState />}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="odd:bg-[#cffdec]"
                role="button"
              >
                
                <TableCell>
                    <div>{item.sensor?.code}</div>
                </TableCell>

                <TableCell>
                    <div>{item.type}</div>
                </TableCell>
                
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.interval).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{item.averageValue}</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <Select
            label="Tampilkan"
            onChange={(e) => {
              setLimit(e.target.value);
            }}
            labelPlacement="outside-left"
            classNames={{ base: "flex items-center" }}
            className="w-40"
            selectedKeys={[limit?.toString() || "10"]}
          >
            <SelectItem key="10">10</SelectItem>
            <SelectItem key="20">20</SelectItem>
            <SelectItem key="30">30</SelectItem>
            <SelectItem key="40">40</SelectItem>
            <SelectItem key="50">50</SelectItem>
          </Select>
          <Pagination
            color="primary"
            total={items.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={items.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
