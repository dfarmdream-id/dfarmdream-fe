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
  Chip,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";
import EmptyState from "@/components/state/empty";
import { IDR } from "@/common/helpers/currency";
import { NumberFormat } from "@/common/helpers/number-format";
import { useGetListTransaksiBarang } from "../../_services/transaksi-barang";

const columns = [
  {
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "namaBarang",
    label: "Nama Barang",
  },
  {
    key: "qtyAsal",
    label: "QTY Asal",
  },
  {
    key: "qtyIn",
    label: "QTY In",
  },
  {
    key: "qtyOut",
    label: "QTY Out",
  },
  {
    key: "qtyAkhir",
    label: "QTY Akhir",
  },
  {
    key: "siteId",
    label: "Lokasi",
  },
  {
    key: "cageId",
    label: "Kandang",
  },

  {
    key: "harga",
    label: "Harga",
  },

  {
    key: "total",
    label: "Total",
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
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });


  const user = useGetListTransaksiBarang(
    useMemo(
      () => ({ q: search || "", page: page || "1", limit: limit || "10" }),
      [search, page, limit]
    )
  );

  const rows = useMemo(() => {
    if (user.data) {
      console.log("Data : ", user.data)
      return user.data?.data?.data || [];
    }
    return [];
  }, [user.data]);


  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Kartu Stok Pakan Obat</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              variant="bordered"
              labelPlacement="outside-left"
              placeholder="Cari"
              value={search || ""}
              onValueChange={(e) => setSearch(e)}
              endContent={<HiSearch />}
            />
            <div className="flex gap-3 items-center flex-wrap md:flex-nowrap"></div>
          </div>

          <Button
            as={Link}
            href="/stock/transaksi/create"
            color="primary"
            startContent={<HiPlus />}
            className="w-full md:w-auto"
          >
            Buat Transaksi
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
                  <div>{item.tanggal}</div>
                </TableCell>

                <TableCell>
                  <div>{item.barang?.namaBarang}</div>
                </TableCell>

                <TableCell>
                  <div>{NumberFormat(item.qtyAsal)}</div>
                </TableCell>

                <TableCell>
                  <div>{NumberFormat(item.qtyIn)}</div>
                </TableCell>

                <TableCell>
                  <div>{NumberFormat(item.qtyOut)}</div>
                </TableCell>

                <TableCell>
                  <div>{NumberFormat(item.qtyAkhir)}</div>
                </TableCell>

                <TableCell>
                  <div>{item.site?.name}</div>
                </TableCell>

                <TableCell>
                  <div>{item.cage?.name}</div>
                </TableCell>

                <TableCell>
                  <div>{IDR(item.harga)}</div>
                </TableCell>

                <TableCell>
                  <div>{IDR(item.total)}</div>
                </TableCell>

                <TableCell>
                  <Chip
                      color={item.status === 1 ? "success" : "danger"}
                      className="text-white"
                    >
                      {item.status === 1 ? "In" : "Out"}
                    </Chip></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <Select
            className="w-40"
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
