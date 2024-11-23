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
import { DateTime } from "luxon";
import { useGetWarehouseTransactions } from "../../master/_services/warehouse-transaction";

const columns = [
  {
    key: "name",
    label: "Jenis",
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
    key: "rack",
    label: "Rack",
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
    throttleMs: 1000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });

  const data = useGetWarehouseTransactions(
    useMemo(() => ({ q: search || "", page: page || "1" }), [search, page])
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
      <div className="space-y-5">
        <div className="flex justify-between items-center gap-3">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Transaksi Gudang"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button
            as={Link}
            href="/transaction/warehouse/create"
            color="primary"
            startContent={<HiPlus />}
          >
            Tambah Transaksi Gudang
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
            isLoading={data.isLoading}
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
                  <div>{item.type == "IN" ? "Masuk" : "Keluar"}</div>
                </TableCell>
                <TableCell>
                  <div>{item.site?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.cage.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.rack.name}</div>
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
