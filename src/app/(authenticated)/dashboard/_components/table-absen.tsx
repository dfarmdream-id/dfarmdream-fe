import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Input,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useGetAbsen } from "../../_services/absen";
import { useMemo } from "react";
import { useQueryState } from "nuqs";
import EmptyState from "@/components/state/empty";
import { HiSearch } from "react-icons/hi";

export default function TableAbsen() {
  const columns = [
    {
      key: "name",
      label: "Nama",
    },
    {
      key: "tanggal",
      label: "Tanggal",
    },
    {
      key: "jamMasuk",
      label: "Jam Masuk",
    },
    {
      key: "jamKeluar",
      label: "jamKeluar",
    },
    {
      key: "jamKeluar",
      label: "Total Jam Kerja",
    },
    {
      key: "status",
      label: "Status",
    },
  ];

  const [search, setSearch] = useQueryState("q", {
    throttleMs: 1000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });

  const attendance = useGetAbsen(
    useMemo(() => ({ q: search || "", page: page || "1", limit: limit || "10" }), [search, page, limit])
  );

  const rows = useMemo(() => {
    if (attendance.data) {
      return attendance.data?.data?.data || [];
    }
    return [];
  }, [attendance.data]);

  const calculateJamKerja = (jamMasuk:string, jamKeluar:string)=>{
    if(!jamMasuk || !jamKeluar){
        return "-"
    }

    const waktuMasuk = new Date(`1970-01-01T${jamMasuk}:00`).getTime();
    const waktuKeluar = new Date(`1970-01-01T${jamKeluar}:00`).getTime();

    // Hitung selisih dalam milidetik
    const selisih = waktuKeluar - waktuMasuk;

    // Konversi selisih milidetik ke jam
    const jamKerja = selisih / (1000 * 60 * 60);
    return jamKerja
  }
  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="font-bold text-xl">Absensi Karyawan</div>
        </CardHeader>
        <CardBody>
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Select
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
        </div>
          <Table aria-label="Example table with dynamic content">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={rows}
              isLoading={attendance.isLoading}
              loadingContent={<Spinner />}
              emptyContent={<EmptyState />}
            >
              {(item) => (
                <TableRow
                  key={item.id}
                  className="odd:bg-[#75B89F]"
                  role="button"
                >
                  <TableCell>
                    <div>{item.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item.jamMasuk}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item.jamKeluar}</div>
                  </TableCell>
                  <TableCell>
                    <div>{calculateJamKerja(item.jamMasuk, item.jamKeluar)}</div>
                  </TableCell>
                  <TableCell>
                  <Chip
                      color={item.status === 1 ? "success" : "danger"}
                      className="text-white"
                    >
                      {item.status === 0 ? "Masuk" : "Absen"}
                    </Chip>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-3">
            <Pagination
              color="primary"
              total={attendance.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={attendance.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
