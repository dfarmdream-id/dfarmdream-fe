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
import { Can } from "@/components/acl/can";
import {DateTime} from "luxon";
import {useGetChickenDiseases} from "@/app/(authenticated)/_services/chicken-disease";

const columns = [
  {
    key: "name",
    label: "Nama Penyakit",
  },
  {
    key: "description",
    label: "Deskripsi",
  },
  {
    key: "symptoms",
    label: "Gejala",
  },
  {
    key: "treatment",
    label: "Pengobatan",
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

  const user = useGetChickenDiseases(
    useMemo(
      () => ({q: search || "", page: page || "1", limit: limit || "10"}),
      [search, page, limit]
    )
  );

    const rows = useMemo(() => {
      if (user.data) {
        return user.data?.data.data || [];
      }
      return [];
    }, [user.data]);

    return (
      <div className="p-5">
        <div className="text-3xl font-bold mb-10">Data Penyakit Ayam</div>
        <div className="space-y-5 bg-white p-5 rounded-lg">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">

              <Input
                startContent={<HiSearch/>}
                placeholder="Cari Ayam"
                variant="bordered"
                value={search || ""}
                onValueChange={setSearch}
              />
            </div>
            <Can action="create:chicken-diseases">
              <Button
                as={Link}
                href="/operational/chicken-diseases/create"
                color="primary"
                startContent={<HiPlus/>}
                className="w-full md:w-auto"
              >
                Tambah Penyakit Ayam
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
              loadingContent={<Spinner/>}
              emptyContent={<EmptyState/>}
            >
              {(item) => (
                <TableRow
                  key={item.id}
                  className="odd:bg-[#cffdec]"
                  role="button"
                >
                  {/* Nama Penyakit */}
                  <TableCell>
                    <div>{item.name}</div>
                  </TableCell>

                  {/* Deskripsi */}
                  <TableCell>
                    <div>{item.description || "-"}</div>
                  </TableCell>

                  {/* Gejala */}
                  <TableCell>
                    <div>{item.symptoms || "-"}</div>
                  </TableCell>

                  {/* Pengobatan */}
                  <TableCell>
                    <div>{item.treatment || "-"}</div>
                  </TableCell>

                  {/* Tanggal Dibuat */}
                  <TableCell>
                    <div>
                      {DateTime.fromISO(item.createdAt, { zone: "local" }).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        { locale: "id" }
                      )}
                    </div>
                  </TableCell>

                  {/* Tanggal Diubah */}
                  <TableCell>
                    <div>
                      {DateTime.fromISO(item.updatedAt, { zone: "local" }).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        { locale: "id" }
                      )}
                    </div>
                  </TableCell>

                  {/* Aksi */}
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
              classNames={{base: "flex items-center"}}
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