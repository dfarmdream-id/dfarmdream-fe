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
  SortDescriptor,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus, HiQrCode } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import Link from "next/link";
import { DateTime } from "luxon";

import { Can } from "@/components/acl/can";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

import { useGetCageRacks } from "../../_services/rack";
import useRackPrintStore from "@/stores/useRackPrintStore";

const columns = [
  { key: "name", label: "Nama" },
  { key: "cage", label: "Kandang" },
  { key: "sites", label: "Lokasi" },
  { key: "createdAt", label: "Tanggal Dibuat" },
  { key: "updatedAt", label: "Tanggal Diubah" },
  { key: "action", label: "Aksi" },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q", { throttleMs: 1000 });
  const [page, setPage] = useQueryState("page", { throttleMs: 1000 });
  const [limit, setLimit] = useQueryState("limit", { throttleMs: 1000 });
  const [sort, setSort] = useQueryState("sort", { throttleMs: 1000 });

  // selectedKeys di sisi komponen
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());

  // Ambil fungsi setSelectedKeys dari Zustand
  const { setSelectedKeys: setRackPrintKeys } = useRackPrintStore();

  const rack = useGetCageRacks(
    useMemo(
      () => ({
        q: search || "",
        page: page || "1",
        limit: limit?.toString() || "10",
        sort: sort || "name:asc",
      }),
      [search, page, limit, sort]
    )
  );

  // Data yang ditampilkan di table
  const rows = useMemo(() => {
    if (rack.data) {
      if (parseInt(page || "1") > rack.data?.data?.meta?.totalPage) {
        setPage(
          rack.data?.data?.meta?.totalPage == 0
            ? "1"
            : rack.data?.data?.meta?.totalPage.toString()
        );
      }
      return rack.data?.data?.data || [];
    }
    return [];
  }, [rack.data]);

  // Handler sorting NextUI
  const handleSortChange = async (key: SortDescriptor) => {
    if (key) {
      const sortKey = key.column as string;
      const sortDirection = key.direction === "ascending" ? "asc" : "desc";
      await setSort(`${sortKey}:${sortDirection}`);
    }
  };

  // Handler selection
  const handleSelectionChange = (keys: "all" | Iterable<React.Key> | undefined) => {
    // NextUI memungkinan "all" atau "undefined" selain Set<Key>
    if (!keys || keys === "all") {
      // misalnya kalau "all", kita mau seleksi semua rows
      // tapi kita contoh: clear aja dulu
      setSelectedKeys(new Set());
      // Kosongkan store juga
      setRackPrintKeys([]);
      return;
    }

    // convert ke Array agar bisa map
    const nextKeys = Array.from(keys) as string[];
    setSelectedKeys(new Set(nextKeys));

    // Lakukan mapping data -> store Zustand
    const mappedData = nextKeys.map((id) => {
      const found = rows.find((item) => item.id === id);
      return {
        id: found?.id || "",
        location: found?.cage?.site?.name || "",
        kandang: found?.cage?.name || "",
        rack: found?.name || "",
      };
    });

    // Simpan ke Zustand
    setRackPrintKeys(mappedData);
  };

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Rak</div>

      <div className="space-y-5 bg-white p-5 rounded-lg">
        {/* Pencarian, dll */}
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Rak"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>

          <div className="flex gap-3">
            <Can action="print:qr-cage">
              <div>
                {selectedKeys.size > 0 && (
                  <Button
                    variant="bordered"
                    color="default"
                    onClick={() => {
                      // Data sudah tersimpan di Zustand,
                      // jadi sekarang cukup buka halaman print
                      window.open("/qr-print/cage/print?print=true", "_blank");
                    }}
                    startContent={<HiQrCode />}
                  >
                    Print QR
                  </Button>
                )}
              </div>
            </Can>

            <Can action="create:cage-rack">
              <Button
                as={Link}
                href="/operational/cage-racks/create"
                color="primary"
                startContent={<HiPlus />}
                className="w-full md:w-auto"
              >
                Tambah Rak
              </Button>
            </Can>
          </div>
        </div>

        {/* Tabel */}
        <Table
          aria-label="Data"
          sortDescriptor={{ column: "name", direction: "ascending" }}
          onSortChange={handleSortChange}
          // multiple selection
          selectionMode="multiple"
          // @ts-ignore
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn allowsSorting key={column.key}>
                {column.label}
              </TableColumn>
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
                className="odd:bg-[#cffdec]"
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
                  <div>
                    {DateTime.fromISO(item.createdAt, { zone: "local" }).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.updatedAt, { zone: "local" }).toLocaleString(
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

        {/* Pagination & Limit */}
        <div className="flex justify-between">
          <Select
            label="Tampilkan"
            onChange={(e) => setLimit(e.target.value)}
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

          {rack.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
              color="primary"
              total={rack.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={rack.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}