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
  SelectItem, ModalContent, ModalHeader, ModalBody, DateRangePicker, Autocomplete, AutocompleteItem, ModalFooter, Modal,
} from "@nextui-org/react";
import {HiOutlineFilter, HiSearch} from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import {useMemo, useState} from "react";
import Link from "next/link";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { useGetListBiaya } from "../../_services/biaya";
import { IDR } from "@/common/helpers/currency";
import SkeletonPagination from "@/components/ui/SkeletonPagination";
import Form from "next/form";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";
import {useGetListKategoriBiaya} from "@/app/(authenticated)/_services/kategori-biaya";
import {useGetListGood} from "@/app/(authenticated)/_services/good";

const columns = [
  {
    key: "batch",
    label: "Batch",
  },
  {
    key: "tanggal",
    label: "Tanggal",
  },
  {
    key: "kategoriId",
    label: "Kategori",
  },
  {
    key: "barang",
    label: "Barang",
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
    key: "userId",
    label: "Karyawan",
  },
  {
    key: "qtyOut",
    label: "QTY Out",
  },
  {
    key: "biaya",
    label: "Biaya",
  },
  {
    key: "keterangan",
    label: "Keterangan",
  },
  {
    key: "createdAt",
    label: "Tanggal Dibuat",
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

  const [showFilter, setShowFilter] = useState(false);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [cageId, setCageId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null)
  const [categoryBiayaSelected, setCategoryBiayaSelected] = useState<string | null>(null);
  const [goodSelected, setGoodSelected] = useState<string | null>(null);

  const user = useGetListBiaya(
    useMemo(() => {
      const params: {
        q: string;
        page: string;
        limit: string;
        batchId?: string;
        cageId?: string;
        dateRange?: { start: string; end: string };
        categoryBiayaId?: string;
        goodId?: string;
      } = {
        q: search || "",
        page: page || "1",
        limit: limit || "10",
      };

      if (batchId) params.batchId = batchId;
      if (cageId) params.cageId = cageId;
      if (dateRange) {
        const [start, end] = dateRange.split(",");
        params.dateRange = { start: start.trim(), end: end.trim() };
      }
      if (categoryBiayaSelected) params.categoryBiayaId = categoryBiayaSelected;
      if (goodSelected) params.goodId = goodSelected;

      return params;
    }, [search, page, limit, batchId, cageId, dateRange, categoryBiayaSelected, goodSelected])
  );

  const rows = useMemo(() => {
    if (user.data) {
      if(parseInt(page || "1") > user.data?.data?.meta?.totalPage) {
        setPage(user.data?.data?.meta?.totalPage == 0 ? "1" : user.data?.data?.meta?.totalPage.toString());
      }
      return user.data?.data?.data || [];
    }
    return [];
  }, [user.data]);

  const { siteId } = useLocationStore();

  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: siteId ?? "" }),
      [siteId]
    )
  );
  
  const categoriBiaya = useGetListKategoriBiaya(
    useMemo(
      () => ({ page: "1", limit: "10000" }),
      []
    )
  )
  
  const goodData = useGetListGood(
    useMemo(
      () => ({ page: "1", limit: "10000" }),
      []
    )
  )

  return (
    <div className="p-5">
      <Modal isOpen={showFilter} onClose={() => setShowFilter(false)}>
        <ModalContent>
          <Form
            action={''}
            onSubmit={() => {
              setShowFilter(false);
            }}
          >
            <ModalHeader>Filter Data</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-3">
                <FilterBatch
                  batchId={batchId}
                  label="Pilih Batch"
                  disableLabel={true} onBatchIdChange={ (batchId) => {setBatchId(batchId);
                }} />
                <Select
                  isLoading={cagesData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  variant="bordered"
                  selectedKeys={[
                    cageId as string,
                  ]}
                  onChange={ (e) => {
                    setCageId(e.target.value);
                  }}
                >
                  {cagesData.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>
                <Autocomplete
                  onSelectionChange={(value) => setCategoryBiayaSelected(
                    value as string
                  )} // Perbarui state
                  labelPlacement="outside"
                  variant="bordered"
                  selectedKey={categoryBiayaSelected} className="w-100" placeholder="Pilih Kategori Biaya">
                  {categoriBiaya?.data?.data?.data.map((status) => (
                    <AutocompleteItem key={status.id}>{status.namaKategori}</AutocompleteItem>
                  )) ?? []}
                </Autocomplete>
                <Autocomplete
                  onSelectionChange={(value) => setGoodSelected(
                    value as string
                  )} // Perbarui state
                  labelPlacement="outside"
                  variant="bordered"
                  selectedKey={goodSelected} className="w-100" placeholder="Pilih Barang">
                  {goodData?.data?.data?.data.map((status) => (
                    <AutocompleteItem key={status.id}>{status.name}</AutocompleteItem>
                  )) ?? []}
                </Autocomplete>
                <DateRangePicker
                  onChange={ (e) => {
                    setDateRange(
                      e.start.toString() + "," + e.end.toString()
                    );
                  }}
                  labelPlacement="outside" variant="bordered" />
              </div>
            </ModalBody>
            <ModalFooter className="grid grid-cols-2">
              <Button
                variant="bordered"
                onPress={ () => {
                  setBatchId(null);
                  setCageId(null);
                  setDateRange(null);
                  setShowFilter(false);
                  setCategoryBiayaSelected(null);
                  setGoodSelected(null);
                }}
              >
                Batal
              </Button>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
      <div className="text-3xl font-bold mb-10">Data Biaya</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              variant="bordered"
              labelPlacement="outside-left"
              placeholder="Cari"
              value={search || ""}
              onValueChange={(e) => setSearch(e)}
              endContent={<HiSearch/>}
            />
            <div>
              <Button
                startContent={<HiOutlineFilter/>}
                onPress={() => {
                  setShowFilter(!showFilter);
                }}
              >
                Filter Data
              </Button>
            </div>
          </div>

          <Button
            as={Link}
            href="/cash/biaya/create"
            color="primary"
            startContent={<HiPlus/>}
            className="w-full md:w-auto"
          >
            Tambah Biaya
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
                  <div>{item?.batch?.name ?? "-"}</div>
                </TableCell>
                <TableCell>
                  <div>{item.tanggal}</div>
                </TableCell>

                <TableCell>
                  <div>{item.kategoriBiaya?.namaKategori}</div>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2 items-center">
                    <div className="flex flex-col">
                      <span className="text-small">{item?.persediaanPakanObat?.goods?.name ?? "-"}</span>
                      <span className="text-tiny text-default-400">{item?.persediaanPakanObat?.goods?.sku ?? "-"}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <div>{item.site?.name}</div>
                </TableCell>

                <TableCell>
                  <div>{item.cage?.name}</div>
                </TableCell>

                <TableCell>
                  <div>{item.user?.fullName}</div>
                </TableCell>

                <TableCell>
                  <div>{item.qtyOut}</div>
                </TableCell>

                <TableCell>
                <div>{IDR(item.biaya)}</div>
                </TableCell>

                <TableCell>
                  <div>{item.keterangan}</div>
                </TableCell>

                <TableCell>
                  <div>
                    {DateTime.fromISO(item.createdAt).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
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
          {user.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
              color="primary"
              total={user.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={user.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
