"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Input,
  Spinner,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import EmptyState from "@/components/state/empty";
import {useGetAbsenLog} from "@/app/(authenticated)/_services/absen";
import { useGetCages } from "../../_services/cage";
import useLocationStore from "@/stores/useLocationStore";

const columns = [
  {
    key: "identityId",
    label: "NIK",
  },
  {
    key: "fullName",
    label: "Nama Pegawai",
  },
  {
    key: "kandang",
    label: "Kandang",
  },
  {
    key: "lokasi",
    label: "Lokasi",
  },
  {
    key:"checkinat",
    label:"Tanggal Check In"
  },
];

// function formatDate(inputDate:string) {
//   const date = new Date(inputDate);

//   const options:any = {
//     year: 'numeric',
//     month: 'short',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: false, 
//   };

//   const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(date);

//   const [day, month, year] = formattedDate.split(' ');
//   const time = date.toTimeString().split(' ')[0]; 
//   const result = `${day} ${month} ${year} ${time}`;

//   return result;
// }

function formatDate(dateString:string) {
  const formattedDate = dateString
      .replace('T', ' ')        
      .substring(0, 19);        
  
  const dateParts = formattedDate.split(" ")[0].split("-"); 
  const timePart = formattedDate.split(" ")[1]; 
  
  return `${dateParts[1]}-${dateParts[2]}-${dateParts[0]} ${timePart}`;
}


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

   const cages = useGetCages(
        useMemo(() => {
          return {
            page: "1",
            limit: "100",
          };
        }, [])
      );
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);
  const {siteId} = useLocationStore()

  const iot = useGetAbsenLog(
    useMemo(
      () => ({ search: search || "", page: page || "1", limit: limit || "10", tanggal: tanggal || "", kandang: kandang || "", lokasi:siteId || "" }),
      [search, page, limit, tanggal, kandang, siteId]
    )
  );

  const rows = useMemo(() => {
    if (iot.data) {
      return iot.data?.data?.data || [];
    }
    return [];
  }, [iot.data]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Attendance</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Pegawai"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />

          
            <Input
              type="date"
              placeholder="Pilih Tanggal"
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full"
            />

         
            <Select
              variant="bordered"
              placeholder="Pilih kandang"
              onChange={(e) => setKandang(e.target.value)} 
              isLoading={cages.isLoading}
              className="w-full"
            >
              {cages.data?.data?.data?.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              )) || []}
            </Select>
          </div>
        </div>
        <Table aria-label="Data">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={rows}
            isLoading={iot.isLoading}
            loadingContent={<Spinner />}
            emptyContent={<EmptyState />}
          >
            {(item) => (
              <TableRow
                key={`${item.identityId}-${item.checkinat}`}
                className="odd:bg-[#cffdec]"
                role="button"
              >
                <TableCell>
                  <div>{item.identityId}</div>
                </TableCell>
                <TableCell>
                  <div>{item.fullName}</div>
                </TableCell>
                <TableCell>
                  <div>{item.kandang}</div>
                </TableCell>
                <TableCell>
                  <div>{item.lokasi}</div>
                </TableCell>
                <TableCell>
                  <div>
                    {item.checkinat?formatDate(item.checkinat):"-"}
                  </div>
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
          <Pagination
            color="primary"
            total={iot.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={iot.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}
