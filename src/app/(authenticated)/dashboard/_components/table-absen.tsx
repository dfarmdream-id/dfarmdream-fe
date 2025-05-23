"use client";

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
import { useMemo, useState } from "react";
import { useQueryState } from "nuqs";
import EmptyState from "@/components/state/empty";
import { DateTime } from "luxon";
import SvgWhatsappIcon from "@/app/(authenticated)/dashboard/_components/whatsapp";
import { useGetCages } from "../../_services/cage";
import useLocationStore from "@/stores/useLocationStore";

export function StatusAbsen({
  checkKandang,
  status,
  total,
}: {
  checkKandang:boolean,
  status: number;
  total: number;
}) {
  if(checkKandang && total>2){
    return <Chip color="danger" className="text-white">
      Absen Abnormal
    </Chip>
  }

  return (
    <Chip color={status === 1 ? "success" : "danger"} className="text-white">
      {status === 1 ? "Masuk" : "Absen"}
    </Chip>
  );
}
export default function TableAbsen() {
  const columns = [
    {
      key: "name",
      label: "Nama",
    },
    {
      key: "siteId",
      label: "Lokasi",
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
      label: "Jam Keluar",
    },
    {
      key: "totalJamKerja",
      label: "Total Jam Kerja",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "action",
      label: "Action",
    },
  ];
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });

  const { siteId } = useLocationStore();

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

  const attendance = useGetAbsen(
    useMemo(
      () => ({
        q: "",
        page: page || "1",
        limit: limit || "10",
        tanggal: tanggal || "",
        kandang: kandang || "",
        lokasi: siteId || "",
      }),
      [page, limit, tanggal, kandang, siteId]
    )
  );

  const rows = useMemo(() => {
    if (attendance.data) {
      return attendance.data?.data?.data || [];
    }
    return [];
  }, [attendance.data]);

  const calculateJamKerja = (jamMasuk: string, jamKeluar: string) => {
    if (!jamMasuk || !jamKeluar) {
      return "-";
    }
    const waktuMasuk = new Date(jamMasuk).getTime();
    const waktuKeluar = new Date(jamKeluar).getTime();
    const selisih = waktuKeluar - waktuMasuk;
    const jamKerja = selisih / (1000 * 60 * 60);
    return jamKerja ? jamKerja.toFixed(2) : 0;
  };

  const formatTanggal = (tanggal: string) => {
    const date = DateTime.fromISO(tanggal);
    const formattedDate = date.toFormat("yyyy-MM-dd"); // Using Luxon to format the date
    return formattedDate;
  };

  // const formatJam = (tanggal:string)=>{
  //   const date = DateTime.fromISO(tanggal);
  //   const formattedDate = date.toFormat('HH:mm'); // Using Luxon to format the date
  //   return formattedDate
  // }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="font-bold text-xl">Absensi Karyawan</div>
        </CardHeader>
        <CardBody>
          {/* <div className="flex justify-between items-center gap-3 flex-wrap mb-5">
            <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
              <div className="flex gap-3 items-center flex-wrap md:flex-nowrap"></div>
            </div>
          </div> */}
          <div className="grid gird-cols-1 xl:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label
                htmlFor="tanggal"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Tanggal
              </label>
              <Input
                type="date"
                placeholder="Pilih Tanggal"
                onChange={(e) => setTanggal(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="kandang"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Kandang
              </label>
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
          <Table aria-label="Data" className="mt-2">
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
                    {item.user &&
                      item.user.sites &&
                      item.user.sites.length > 0 && (
                        <>{item.user.sites[0].site.name}</>
                      )}
                  </TableCell>
                  <TableCell>
                    <div>
                      {item.tanggal ? formatTanggal(item.tanggal) : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{item.jamMasuk ? item.jamMasuk : "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item.jamKeluar ? item.jamKeluar : "-"}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {item.jamMasuk && item.jamKeluar
                        ? calculateJamKerja(
                            item.timestampMasuk,
                            item.timestampKeluar
                          )
                        : "-"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusAbsen
                      checkKandang={item.user?.position?.checkKandang || false}
                      status={item.status}
                      total={item.total}
                    />
                  </TableCell>
                  {/* icon wa to redirect to wa */}
                  <TableCell>
                    {item.status === 1 && !item.jamKeluar ? (
                      <div className="flex gap-3">
                        <a
                          href={`https://wa.me/${
                            item.user?.phone?.startsWith("08")
                              ? `62${item.user.phone.slice(1)}`
                              : item.user?.phone
                          }`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <SvgWhatsappIcon className="cursor-pointer" />
                        </a>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-3">
            <div className="max-w-[10rem] w-full">
              <Select
                label="Tampilkan"
                onChange={(e) => {
                  setLimit(e.target.value);
                }}
                labelPlacement="outside-left"
                classNames={{ base: "flex items-center max-w-lg" }}
                selectedKeys={[limit?.toString() || "10"]}
              >
                <SelectItem key="10">10</SelectItem>
                <SelectItem key="20">20</SelectItem>
                <SelectItem key="30">30</SelectItem>
                <SelectItem key="40">40</SelectItem>
                <SelectItem key="50">50</SelectItem>
              </Select>
            </div>
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
