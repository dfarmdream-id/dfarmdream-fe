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
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { useGetInvestors } from "../_services/investor";

const columns = [
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "role",
    label: "No NIK",
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
    key: "username",
    label: "Username",
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

  const user = useGetInvestors(
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
      <div className="text-3xl font-bold mb-10">Data Investor</div>
      <div className="space-y-5">
        <div className="flex justify-between items-center gap-3">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Investor"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/master/investors/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah Investor
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
            emptyContent={<EmptyState />}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="hover:bg-gray-100"
                role="button"
              >
                <TableCell>
                  <div>{item.fullName}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.identityId}</div>
                </TableCell>
                <TableCell>
                  <div>{item.phone}</div>
                </TableCell>
                <TableCell>
                  <div>{item.address}</div>
                </TableCell>
                <TableCell>
                  <div>{item.username}</div>
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
