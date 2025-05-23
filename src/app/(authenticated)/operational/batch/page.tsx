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
import { useGetBatchs } from "../../_services/batch";
import { useMemo } from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { Can } from "@/components/acl/can";
import {DateTime} from "luxon";
import useLocationStore from "@/stores/useLocationStore";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

const columns = [
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "startDate",
    label: "Tanggal Mulai",
  },
  {
    key: "endDate",
    label: "Tanggal Berakhir",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "createdAt",
    label: "Tanggal Dibuat",
  },
  {
    key: "updatedAt",
    label: "Tanggal Diupdate",
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
  
  const {siteId} = useLocationStore();

  const cage = useGetBatchs(
    useMemo(
      () => ({ q: search || "", page: page || "1", limit: limit || "10", siteId }),
      [search, page, limit, siteId]
    )
  );

  const rows = useMemo(() => {
    if (cage.data) {
      if(parseInt(page || "1") > cage.data?.data?.meta?.totalPage) {
        setPage(cage.data?.data?.meta?.totalPage == 0 ? "1" : cage.data?.data?.meta?.totalPage.toString());
      }
      return cage.data?.data?.data || [];
    }
    return [];
  }, [cage.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Batch</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Batch"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Can action="create:batch">
            <Button
              as={Link}
              href="/operational/batch/create"
              color="primary"
              startContent={<HiPlus />}
              className="w-full md:w-auto"
            >
              Tambah Batch
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
            isLoading={cage.isLoading}
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
                  <div>
                    {DateTime.fromISO(item.startDate, {zone: 'local'}).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      {locale: 'id'}
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {
                      item?.endDate ? 
                      DateTime.fromISO(item?.endDate, {zone: 'local'}).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      {locale: 'id'}
                    ) : "-"}
                  </div>
                </TableCell>
                <TableCell>
                  <div>{item.status}</div>
                </TableCell>
                <TableCell>
                  <div>{DateTime.fromISO(item.createdAt, {zone: 'local'}).toLocaleString(
                    DateTime.DATETIME_MED_WITH_WEEKDAY,
                    {locale: 'id'}
                  )}</div>
                </TableCell>
                <TableCell>
                  <div>{DateTime.fromISO(item.updatedAt, {zone: 'local'}).toLocaleString(
                    DateTime.DATETIME_MED_WITH_WEEKDAY,
                    {locale: 'id'}
                  )}</div>
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
          {cage.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
              color="primary"
              total={cage.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={cage.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
