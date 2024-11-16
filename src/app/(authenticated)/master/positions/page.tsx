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
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";
import { useGetPositions } from "../_services/position";
import Actions from "./_components/actions";

const columns = [
  {
    key: "id",
    label: "id",
  },
  {
    key: "name",
    label: "Nama",
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

  const user = useGetPositions(
    useMemo(() => ({ q: search || "", page: page || "1" }), [search, page])
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
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Jabatan"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/master/positions/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah Jabatan
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
            isLoading={user.isLoading}
            loadingContent={<Spinner />}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-100"
                role="button"
              >
                <TableCell>
                  <div>{item.id}</div>
                </TableCell>
                <TableCell>
                  <div>{item.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.createdAt}</div>
                </TableCell>
                <TableCell>
                  <div>{item.updatedAt}</div>
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
