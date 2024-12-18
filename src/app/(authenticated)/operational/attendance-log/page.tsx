"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import {useGetAbsenLog} from "@/app/(authenticated)/_services/absen";

const columns = [
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
    key:"checkinat",
    label:"Tanggal Check In"
  },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q", {
    throttleMs: 1000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });

  const iot = useGetAbsenLog(
    useMemo(
      () => ({ search: search || "", page: page || "1", limit: limit || "10" }),
      [search, page, limit]
    )
  );

  const rows = useMemo(() => {
    if (iot.data) {
      return iot.data?.data?.data || [];
    }
    return [];
  }, [iot.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Attendance</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Sensor"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
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
                key={`${item.nip}-${item.checkinat}`}
                className="odd:bg-[#cffdec]"
                role="button"
              >
                <TableCell>
                  <div>{item.fullName}</div>
                </TableCell>
                <TableCell>
                  <div>{item.kandang}</div>
                </TableCell>
                <TableCell>
                  <div>{item.lokasi}</div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.checkinat).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
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
            className="w-40"
            classNames={{ base: "flex items-center" }}
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
