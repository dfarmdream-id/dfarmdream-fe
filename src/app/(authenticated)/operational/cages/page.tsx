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
  Select,
  SelectItem,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useGetCages } from "../../_services/cage";
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
    key: "site",
    label: "Lokasi",
  },
  {
    key: "width",
    label: "Lebar",
  },
  {
    key: "height",
    label: "Tinggi",
  },
  {
    key: "capacity",
    label: "Kapasitas",
  },
  {
    key: "status",
    label: "Status",
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

  const cage = useGetCages(
    useMemo(() => ({ q: search || "", page: page || "1" }), [search, page])
  );

  const rows = useMemo(() => {
    if (cage.data) {
      return cage.data?.data?.data || [];
    }
    return [];
  }, [cage.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Kandang</div>
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
            </Select>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Kandang"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/operational/cages/create"
            color="primary"
            startContent={<HiPlus />}
className="w-full md:w-auto"
          >
            Tambah Kandang
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
            isLoading={cage.isLoading}
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
                  <div>{item.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.site?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.width}</div>
                </TableCell>
                <TableCell>
                  <div>{item.height}</div>
                </TableCell>
                <TableCell>
                  <div>{item.capacity}</div>
                </TableCell>

                <TableCell>
                  <Chip
                    color={item.status === "ACTIVE" ? "success" : "danger"}
                    className="text-white"
                  >
                    {item.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
                  </Chip>
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
            total={cage.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={cage.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
