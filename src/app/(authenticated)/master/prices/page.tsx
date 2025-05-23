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
  Chip,
  Select,
  SelectItem
} from "@nextui-org/react";
import {  HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useMemo } from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import { useGetPrices } from "../../_services/price";
import { IDR } from "@/common/helpers/currency";
import { Can } from "@/components/acl/can";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

const columns = [
  {
    key: "site",
    label: "Lokasi",
  },
  {
    key: "type",
    label: "Tipe",
  },
  {
    key: "value",
    label: "Harga",
  },
  {
    key: "weightPerUnit",
    label: "Berat per Unit",
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
  const [siteId] = useQueryState("siteId", {
    throttleMs: 1000,
  });
  

  const user = useGetPrices(
    useMemo(
      () => ({
        q: search || "",
        page: page || "1",
        limit: limit || "10",
        siteId: siteId as string,
      }),
      [search, page, limit, siteId]
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
      <div className="text-3xl font-bold mb-10">Data Harga</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="w-full md:w-fit flex gap-3">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Harga"
              variant="bordered"
              value={search || ""}
              name="q"
              onValueChange={setSearch}
            />
          </div>
          <Can action="create:price">
            <Button
              as={Link}
              href="/master/prices/create"
              color="primary"
              startContent={<HiPlus />}
              className="w-full md:w-auto"
            >
              Tambah Harga
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
                  <div>{item?.site?.name}</div>
                </TableCell>
                <TableCell>
                  <div>{item.type == "CHICKEN" ? "Ayam" : "Telur"}</div>
                </TableCell>
                <TableCell>
                  <div>{IDR(item.value || 0)}</div>
                </TableCell>
                <TableCell>
                  <div>{item?.weightPerUnit} KG</div>
                </TableCell>
                <TableCell>
                  <div>
                    {item.status == "ACTIVE" ? (
                      <Chip color="success">Aktif</Chip>
                    ) : (
                      <Chip color="danger">Tidak Aktif</Chip>
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
                  <div>
                    {DateTime.fromISO(item.createdAt).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Actions id={item.id} siteId={item.siteId} />
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
