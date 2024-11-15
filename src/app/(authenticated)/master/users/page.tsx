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
import { useGetUsers } from "../_services/user";
import { useMemo } from "react";
import Link from "next/link";

const columns = [
  {
    key: "id",
    label: "id",
  },
  {
    key: "fullName",
    label: "Nama",
  },
  {
    key: "role",
    label: "Jabatan",
  },
  {
    key: "phone",
    label: "No HP",
  },
  {
    key: "address",
    label: "Alamat",
  },
  {
    key: "status",
    label: "Status",
  },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q", {
    throttleMs: 1000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });

  const user = useGetUsers(
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
      <div className="text-3xl font-bold mb-10">Data Pengguna</div>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Pengguna"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/master/users/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah Pengguna
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
                  <div>{item.fullName}</div>
                </TableCell>
                <TableCell>
                  <div>{item.position}</div>
                </TableCell>
                <TableCell>
                  <div>{item.phone}</div>
                </TableCell>
                <TableCell>
                  <div>{item.address}</div>
                </TableCell>
                <TableCell>
                  <Chip color={item.status === "active" ? "success" : "danger"}>
                    {item.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </Chip>
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
