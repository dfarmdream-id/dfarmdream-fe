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
import { useGetListCOA } from "../../_services/coa";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

const columns = [
  {
    key: "code",
    label: "Kode",
  },
  {
    key: "name",
    label: "Nama COA",
  },
  {
    key: "level",
    label: "Level",
  },
  {
    key: "group",
    label: "Group",
  },
  {
    key: "isBalanceSheet",
    label: "Is Neraca",
  },
  {
    key: "isRetainedEarnings",
    label: "Is Laba Tahan",
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
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });

  const user = useGetListCOA(
    useMemo(
      () => ({ q: search || "", page: page || "1", limit: limit || "10" }),
      [search, page, limit]
    )
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

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data COA</div>
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
            href="/cash/coa/create"
            color="primary"
            startContent={<HiPlus />}
            className="w-full md:w-auto"
          >
            Tambah Akun
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
                  <div>{item.code}</div>
                </TableCell>
                <TableCell>
                  <div>{item.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.level}</div>
                </TableCell>

                <TableCell>
                  <div>{item.group?.name}</div>
                </TableCell>

                <TableCell>
                  <div>{item.isBalanceSheet?'Y':'T'}</div>
                </TableCell>

                <TableCell>
                  <div>{item.isRetainedEarnings?'Y':'T'}</div>
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
