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
import { useGetCageRacks } from "../_services/rack";
import { useMemo } from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";

const columns = [
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "cage",
    label: "Kandang",
  },
  {
    key: "sites",
    label: "Lokasi",
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

  const rack = useGetCageRacks(
    useMemo(() => ({ q: search || "", page: page || "1" }), [search, page])
  );

  const rows = useMemo(() => {
    if (rack.data) {
      return rack.data?.data?.data || [];
    }
    return [];
  }, [rack.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Rak</div>
      <div className="space-y-5">
        <div className="flex justify-between items-center gap-3">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Rak"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/master/cage-racks/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah Rak
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
            isLoading={rack.isLoading}
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
                  <div>{item.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.cage?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.cage?.site?.name}</div>
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
            total={rack.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={rack.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
