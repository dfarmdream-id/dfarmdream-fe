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
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";
import { useGetPositions } from "../../_services/position";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { Can } from "@/components/acl/can";

const columns = [
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "checkinTime",
    label: "Jam Masuk",
  },
  {
    key: "checkoutTime",
    label: "Jam Keluar",
  },
  {
    key: "createdAt",
    label: "Tanggal Dibuat",
  },
  {
    key: "updatedAt",
    label: "Tanggal Diubah",
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
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });

  const user = useGetPositions(
    useMemo(
      () => ({ q: search || "", page: page || "1", limit: limit || "10" }),
      [search, page, limit]
    )
  );

  const rows = useMemo(() => {
    if (user.data) {
      return user.data?.data?.data || [];
    }
    return [];
  }, [user.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Jabatan</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Select
              label="Tampilkan"
              onChange={(e) => {
                setLimit(e.target.value);
              }}
              labelPlacement="outside-left"
              classNames={{ base: "flex items-center" }}
              selectedKeys={[limit?.toString() || "10"]}
            >
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="30">30</SelectItem>
              <SelectItem key="40">40</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>{" "}
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Jabatan"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Can action="create:position">
            <Button
              as={Link}
              href="/master/positions/create"
              color="primary"
              startContent={<HiPlus />}
              className="w-full md:w-auto"
            >
              Tambah Jabatan
            </Button>
          </Can>
        </div>
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={user.isLoading}
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
                  <div>{item.name}</div>
                </TableCell>
                <TableCell>
                  <div>{DateTime.fromISO(item.checkinTime).toFormat('HH:mm')}</div>
                </TableCell>
                <TableCell>
                  <div>{DateTime.fromISO(item.checkoutTime).toFormat('HH:mm')}</div>
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
                  <div>
                    {DateTime.fromISO(item.createdAt).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
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
            total={user.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={user.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
