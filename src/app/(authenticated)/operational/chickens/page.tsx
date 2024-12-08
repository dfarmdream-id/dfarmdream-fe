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
  Chip,
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
import {useGetChickens, useUpdateChicken} from "../../_services/chicken";
import { Can } from "@/components/acl/can";
import {DateTime} from "luxon";

const columns = [
  {
    key: "fullName",
    label: "Nama",
  },
  {
    key: "role",
    label: "Rak",
  },
  {
    key: "cage",
    label: "Kandang",
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

  const user = useGetChickens(
    useMemo(
      () => ({q: search || "", page: page || "1", limit: limit || "10"}),
      [search, page, limit]
    )
  );

  const submission = useUpdateChicken();

  const handleStatus = (data: {
    id: string;
    status: string;
  }) => {
    if (data) {
      submission.mutate(
        {
          body: {
            status: data.status === "ALIVE" ? "DEAD" : "ALIVE",
          },
          pathVars: {
            id: data.id,
          },
        },
        {
          onSuccess: async () => {
            await user.refetch();
          },
        }
      );
    }
  }

    const rows = useMemo(() => {
      if (user.data) {
        // Ambil data
        const rawData = user.data?.data?.data || [];

        // Sorting data berdasarkan hierarki
        return rawData.sort((a, b) => {
          // Urutkan berdasarkan cage.name (case-insensitive)
          const cageNameA = a?.rack?.cage?.name?.toLowerCase() ?? "";
          const cageNameB = b?.rack?.cage?.name?.toLowerCase() ?? "";
          if (cageNameA < cageNameB) return -1;
          if (cageNameA > cageNameB) return 1;

          // Jika cage.name sama, urutkan berdasarkan rack.name
          const rackNameA = a?.rack?.name?.toLowerCase() ?? "";
          const rackNameB = b?.rack?.name?.toLowerCase() ?? "";
          if (rackNameA < rackNameB) return -1;
          if (rackNameA > rackNameB) return 1;

          // Jika rack.name sama, urutkan berdasarkan name (user)
          const userNameA = a.name.toLowerCase();
          const userNameB = b.name.toLowerCase();
          return userNameA.localeCompare(userNameB, undefined, {
            numeric: true, // Perhatikan angka saat sorting
            sensitivity: 'base', // Case-insensitive
          });
        });
      }
      return [];
    }, [user.data]);

    return (
      <div className="p-5">
        <div className="text-3xl font-bold mb-10">Data Ayam</div>
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
            <Can action="create:chicken">
              <Button
                as={Link}
                href="/operational/chickens/create"
                color="primary"
                startContent={<HiPlus/>}
                className="w-full md:w-auto"
              >
                Tambah Ayam
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
                  <TableCell>
                    <div>{item.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item?.rack?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item?.rack?.cage?.name}</div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.status === "ALIVE" ? "success" : "danger"}
                      className="text-white"
                      onClick={() => handleStatus(item)}
                    >
                      {item.status === "ALIVE" ? "Hidup" : "Mati"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div>
                      {DateTime.fromISO(item.createdAt, {zone: 'local'}).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        {locale: 'id'}
                      )} 
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {DateTime.fromISO(item.updatedAt, {zone: 'local'}).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        {locale: 'id'}
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Actions id={item.id}/>
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