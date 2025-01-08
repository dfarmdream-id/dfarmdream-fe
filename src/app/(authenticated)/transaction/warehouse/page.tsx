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
  SelectItem, ModalContent, ModalHeader, ModalBody, ModalFooter, Modal,
  DateRangePicker,
} from "@nextui-org/react";
import {HiOutlineFilter, HiSearch} from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import {useMemo, useState} from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { useGetWarehouseTransactions } from "../../_services/warehouse-transaction";
import { Can } from "@/components/acl/can";
import Form from "next/form";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

const columns = [
  {
    key: "batch",
    label: "Batch",
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
    key: "CashierDeliveryAt",
    label: "Tanggal Kirim Kasir",
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
  
  const [batchId, setBatchId] = useState<string | null>(null);
  const [cageId, setCageId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null)

  const data = useGetWarehouseTransactions(
    useMemo(() => {
      const params: Record<string, string> = {
        q: search || "",
        page: page || "1",
        limit: limit || "10",
      };

      // Tambahkan hanya jika memiliki value
      if (batchId) params.batchId = batchId;
      if (cageId) params.cageId = cageId;
      if (dateRange) params.dateRangeFilter = dateRange;

      return params;
    }, [search, page, limit, batchId, cageId, dateRange])
  );

  const rows = useMemo(() => {
    if (data.data) {
      if(parseInt(page || "1") > data.data?.data?.meta?.totalPage) {
        setPage(data.data?.data?.meta?.totalPage == 0 ? "1" : data.data?.data?.meta?.totalPage.toString());
      }
      return data.data?.data?.data || [];
    }
    return [];
  }, [data.data]);

  const [showFilter, setShowFilter] = useState(false);
  
  const {siteId} = useLocationStore();

  const cage = useGetCages(
    useMemo(
      () => ({
        page: "1",
        limit: "100",
        siteId: siteId as string,
      }),
      [siteId]
    )
  );

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
                  disableLabel={true} onBatchIdChange={async (batchId) => {
                  await setBatchId(batchId);
                }} />
                <Select
                  isLoading={cage.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  variant="bordered"
                  selectedKeys={[
                    cageId as string,
                  ]}
                  onChange={async (e) => {
                    await setCageId(e.target.value);
                  }}
                >
                  {cage.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>
                <DateRangePicker
                  onChange={async (e) => {
                    await setDateRange(
                      e.start.toString() + "," + e.end.toString()
                    );
                  }}
                  labelPlacement="outside" variant="bordered" />
              </div>
            </ModalBody>
            <ModalFooter className="grid grid-cols-2">
              <Button
                variant="bordered"
                onPress={async () => {
                  // reset
                  await setBatchId(null);
                  await setCageId(null);
                  await setDateRange(null);
                  setShowFilter(false);
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
      <div className="text-3xl font-bold mb-10">Data Transaksi Gudang</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch/>}
              placeholder="Cari Transaksi Gudang"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
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
          <Can action="create:warehouse-transaction">
            <Button
              as={Link}
              href="/transaction/warehouse/create"
              color="primary"
              startContent={<HiPlus/>}
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
                  <div>{item.batch?.name ?? '-'}</div>
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
                  <div>
                    {item.qty} {item.category == "EGG" ? "Butir" : "Ekor"}
                    {item.qtyCrack ? ` (${item.qtyCrack} Retak)` : ""}
                  </div>
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
                  {item.CashierDeliveryAt ?   <div>
                    {DateTime.fromISO(item.CashierDeliveryAt!, { zone: 'local' }).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: 'id' }
                    )}
                  </div>:'-' }
                
                </TableCell>

                <TableCell>
                  <Actions id={item.id} CashierDeliveryAt={item.CashierDeliveryAt} />
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
          {data.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
            color="primary"
            total={data.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={data.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
          )}
        </div>
      </div>
    </div>
  );
}
