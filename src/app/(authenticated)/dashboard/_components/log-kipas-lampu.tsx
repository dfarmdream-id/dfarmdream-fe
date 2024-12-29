"use client";
import {
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
import { ReactNode, useMemo, useState } from "react";
import { useGetCages } from "../../_services/cage";
import {
  useGetRelayLogData,
} from "../../_services/iot-device";
import EmptyState from "@/components/state/empty";
import { useQueryState } from "nuqs";
import { DateTime } from "luxon";
import useLocationStore from "@/stores/useLocationStore";



export default function LogKipasLampu({
  children,
}: {
  children: ReactNode;
}) {
  const [kandang, setKandang] = useState<string | null>(null);
  const [tanggal, setTanggal] = useState<string | null>(null);
  const { siteId } = useLocationStore();

  const columns = [
    {
      key: "lokasi",
      label: "Lokasi",
    },
    {
      key: "kandang",
      label: "Kandang",
    },
    {
      key: "tanggal",
      label: "Tanggal",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "relayDesc",
      label: "Deskripsi",
    },
  ];

  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });

  const limit: string = "10";

  const relayLogs = useGetRelayLogData(
    useMemo(
      () => ({
        q: "",
        page: page || "1",
        limit: limit || "10",
        tanggal: tanggal || "",
        cageId: kandang || "",
        siteId: siteId || "",
      }),
      [page, limit, tanggal, kandang, siteId]
    )
  );

  const rows = useMemo(() => {
    if (relayLogs.data) {
      return relayLogs.data?.data?.data || [];
    }
    return [];
  }, [relayLogs.data]);

  const cages = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));

  return (
    <div className="bg-white rounded-lg p-5 gap-3">
         <div className="text-xl text-primary font-bold text-center">
              {children}
            </div>
      <div className="grid lg:grid-cols-2 bg-white rounded-lg p-5 gap-3">
        <div className="flex flex-col gap-3 w-full overflow-hidden space-y-5">
          <div className="w-full">
            <Input
              type="date"
              placeholder="Pilih Tanggal"
              onChange={(e) => setTanggal(e.target.value)}
              className="mb-3 mt-1"
            />
          </div>
        </div>
        <div className="w-full overflow-hidden space-y-5">
          <div className="grid gap-3">
            <Select
              variant="bordered"
              placeholder="Pilih kandang"
              isLoading={cages.isLoading}
              onChange={(e) => setKandang(e.target.value)}
            >
              {cages.data?.data?.data?.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              )) || []}
            </Select>
          </div>
        </div>
      </div>
        <div className="mt-5">
          <Table aria-label="Data">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={rows}
              isLoading={relayLogs.isLoading}
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
                    <div>{item.sensor?.cage?.site?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item.sensor?.cage?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {/* {DateTime.fromISO(item.createdAt).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        { locale: "id" }
                      )} */}
                      {DateTime.fromISO(item.createdAt,{ zone: 'utc' })
                        .setZone("Asia/Jakarta")
                        .toFormat("dd MM yyyy, HH:mm:ss")}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.status === 1 ? "success" : "danger"}
                      className="text-white"
                    >
                      {item.status === 1 ? "Nyala" : "Mati"}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div>{item.relayDesc}</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-3">
            <Pagination
              color="primary"
              total={relayLogs.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={relayLogs.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          </div>
        </div>
    </div>
  );
}
