"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Pagination,
  Button,
  Input,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";

const rows = [
  {
    id: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
    phone: "(245) 456-0654",
    address: "3517 W. Gray St. Utica, PA 57867",
  },
  {
    id: "2",
    name: "Linda",
    role: "CTO",
    status: "Inactive",
    phone: "(245) 456-0654",
    address: "3517 W. Gray St. Utica, PA 57867",
  },
];

const columns = [
  {
    key: "id",
    label: "id",
  },
  {
    key: "name",
    label: "Nama",
  },
  {
    key: "role",
    label: "Jabatan",
  },
  {
    key: "phone",
    label: "No HP",
  },
  {
    key: "address",
    label: "Alamat",
  },
  {
    key: "status",
    label: "Status",
  },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q");

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Pengguna</div>
      <div className="space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Pengguna"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
          </div>
          <Button color="primary" startContent={<HiPlus />}>
            Tambah Pengguna
          </Button>
        </div>
        <Table aria-label="Example table with dynamic content">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div>
          <Pagination total={10} initialPage={1} />
        </div>
      </div>
    </div>
  );
}
