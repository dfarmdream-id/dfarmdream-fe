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
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { useGetWarehouseTransactions } from "../../_services/warehouse-transaction";
import { Can } from "@/components/acl/can";

const columns = [
  {
    key: "name",
    label: "Jenis",
  },
  {
    key: "category",
    label: "Kategori",
  },
  {
    key: "site",
    label: "Lokasi",
  },
  {
    key: "cage",
    label: "Kandang",
  },
  {
    key: "weight",
    label: "Berat",
  },
  {
    key: "total",
    label: "Qty",
  },
  {
    key: "createdBy",
    label: "Dibuat Oleh",
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
    throttleMs: 10000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 10000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 10000,
  });

  const data = useGetWarehouseTransactions(
    useMemo(
      () => ({ q: search || "", page: page || "1", limit: limit || "10" }),
      [search, page, limit]
    )
  );

  const rows = useMemo(() => {
    if (data.data) {
      return data.data?.data?.data || [];
    }
    return [];
  }, [data.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Transaksi Gudang</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Transaksi Gudang"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Can action="create:warehouse-transaction">
            <Button
              as={Link}
              href="/transaction/warehouse/create"
              color="primary"
              startContent={<HiPlus />}
              className="w-full md:w-auto"
            >
              Tambah Transaksi Gudang
            </Button>
          </Can>
        </div>
        <Table aria-label="Data">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={data.isLoading}
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
                  <div>{item.type == "IN" ? "Masuk" : "Keluar"}</div>
                </TableCell>
                <TableCell>
                  <div>{item.category == "EGG" ? "Telur" : "Ayam"}</div>
                </TableCell>
                <TableCell>
                  <div>{item.site?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.cage.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.weight}</div>
                </TableCell>
                <TableCell>
                  <div>{item.qty}</div>
                </TableCell>
                <TableCell>
                  <div>{item.createdBy.fullName}</div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.createdAt, { zone: 'local' }).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: 'id' }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.updatedAt, { zone: 'local' }).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: 'id' }
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
            total={data.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={data.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
