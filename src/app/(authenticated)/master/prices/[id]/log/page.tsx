"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
  Select,
  SelectItem,
  DateRangePicker,
} from "@nextui-org/react";

import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { IDR } from "@/common/helpers/currency";
import { useParams } from "next/navigation";
import { useGetPriceLog } from "@/app/(authenticated)/_services/price";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

const columns = [
  {
    key: "createdAt",
    label: "Tanggal Diubah",
  },
  {
    key: "type",
    label: "Tipe",
  },
  {
    key: "site",
    label: "Lokasi",
  },

  {
    key: "price",
    label: "Harga",
  },

  {
    key: "userId",
    label: "Diubah Oleh",
  },
];

export default function Page() {
  
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });
 
  const [tanggal, setTanggal] = useState<string | null>(null);
  

  const params = useParams();
  
  const items = useGetPriceLog(
    useMemo(
      () => ({
        q: "",
        page: page || "1",
        limit: limit || "10",
        siteId: params.id as string,
        tanggal: tanggal || "",
      }),
      [ page, limit, params.id, tanggal]
    )
  );

 
  const rows = useMemo(() => {
    if (items.data) {
      return items.data?.data?.data || [];
    }
    return [];
  }, [items.data]);

  return (
    <div className="p-5">
      
      <div className="text-3xl font-bold mb-10">Data Log Harga </div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="w-full md:w-fit flex gap-3">
            <DateRangePicker variant="bordered"
              onChange={
                (e) => {
                  setTanggal(`${e?.start?.toString() || ""},${e?.end?.toString() || ""}`);
                }
              }
            /> 
            </div>
          </div>
        </div>
      

      <div className="space-y-5 bg-white p-5 rounded-lg">
        <Table aria-label="Data">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={items.isLoading}
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
                  <div>
                    {DateTime.fromISO(item.createdAt).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <div>{item.type == "CHICKEN" ? "Ayam" : "Telur"}</div>
                </TableCell>
                <TableCell>
                    <div>{item.site?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{IDR(item.price || 0)}</div>
                </TableCell>
                <TableCell>
                  <div>{item.user?.username}</div>
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
            classNames={{ base: "flex items-center" }}
            className="w-40"
            selectedKeys={[limit?.toString() || "10"]}
          >
            <SelectItem key="10">10</SelectItem>
            <SelectItem key="20">20</SelectItem>
            <SelectItem key="30">30</SelectItem>
            <SelectItem key="40">40</SelectItem>
            <SelectItem key="50">50</SelectItem>
          </Select>
          {items.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
              color="primary"
              total={items.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={items.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
