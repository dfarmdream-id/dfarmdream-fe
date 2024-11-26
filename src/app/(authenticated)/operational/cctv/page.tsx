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
  SelectItem,
  Select,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { useGetAllCCTV } from "../../_services/cctv";

const columns = [
  {
    key: "cageId",
    label: "Kandang",
  },
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "ipAddress",
    label: "IP/URL",
  },
  {
    key: "description",
    label: "Deskripsi",
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

  const cctv = useGetAllCCTV(
    useMemo(() => ({ q: search || "", page: page || "1" }), [search, page])
  );

  const rows = useMemo(() => {
    if (cctv.data) {
      return cctv.data?.data?.data || [];
    }
    return [];
  }, [cctv.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data CCTV</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari CCTV"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/operational/cctv/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah CCTV
          </Button>
        </div>
        <Table aria-label="Data">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={cctv.isLoading}
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
                  <div>{item?.cage?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.ipAddress}</div>
                </TableCell>
                <TableCell>
                  <div>{item.description}</div>
                </TableCell>
                <TableCell>
                  <Actions id={item.id} />
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
            total={cctv.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={cctv.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
