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
  Spinner, DateRangePicker,
} from "@nextui-org/react";
import {HiSearch, HiX} from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import {useMemo, Fragment, useRef} from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { useGetListJournal } from "@/app/(authenticated)/_services/journal";
import { SingleJournalData } from "@/app/(authenticated)/_models/response/journal";

const groupByJournalId = (rows: SingleJournalData[]) => {
  return rows.reduce<Record<string, SingleJournalData>>((acc, row) => {
    acc[row.id] = row;
    return acc;
  }, {});
};

export default function Page() {
  const pickerRef = useRef(null);
  
  const [search, setSearch] = useQueryState("q", { throttleMs: 1000 });
  const [page, setPage] = useQueryState("page", { throttleMs: 1000 });
  const [dateRange, setDateRange] = useQueryState("dateRange", { throttleMs: 1000 });

  const journalData = useGetListJournal(
    useMemo(
      () => ({
        q: search || "",
        page: page || "1",
        limit: "10",
        ...(dateRange ? { dateRange } : {}),
      }),
      [search, page, dateRange]
    )
  );

  const rows: SingleJournalData[] = useMemo(() => {
    return journalData.data?.data?.data || [];
  }, [journalData.data]);

  const groupedRows = useMemo(() => {
    return groupByJournalId(rows);
  }, [rows]);

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Jurnal</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center">
            <Input
              variant="bordered"
              placeholder="Cari"
              value={search || ""}
              onValueChange={setSearch}
              endContent={<HiSearch />}
            />
            <DateRangePicker 
              ref={pickerRef}  
              variant="bordered"
              value={dateRange}
              onChange={setDateRange}
            />
            {
              dateRange && (
                <Button 
                  color="danger" 
                  onClick={async () => {
                    await setDateRange(null);
                  }}
                >
                  <HiX />
                </Button>
              )
            }
          </div>
          <Button
            as={Link}
            // journalData.data?.data?.meta?.totalData // JN-12-24-01
            href={`/cash/journal/create/?journalCode=JN-${DateTime.now().toFormat("yy-MM")}-${(journalData.data?.data?.meta?.totalData ?? 1).toString().padStart(2, "0")}`}
            color="primary"
            startContent={<HiPlus />}
            className="w-full md:w-auto"
          >
            Tambah Jurnal
          </Button>
        </div>
        <Table aria-label="Data">
          <TableHeader>
            <TableColumn>Date</TableColumn>
            <TableColumn>Type Journal</TableColumn>
            <TableColumn>Account Code</TableColumn>
            <TableColumn>Account</TableColumn>
            <TableColumn>Debit</TableColumn>
            <TableColumn>Credit</TableColumn>
            <TableColumn>Posted Date</TableColumn>
            <TableColumn>Posted By</TableColumn>
            <TableColumn>Note</TableColumn>
          </TableHeader>
          <TableBody
            isLoading={journalData.isLoading}
            loadingContent={<Spinner />}
          >
            {Object.entries(groupedRows).map(([journalId, journal]) => {
              return (
                <Fragment key={journalId}>
                  {/* Header Row */}
                  <TableRow>
                    <TableCell className="font-bold">
                      {`${journal.code}`}
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                  </TableRow>
                  {/* Detail Rows */}
                  {journal.journalDetails.map((detail) => (
                    <TableRow key={detail.id}>
                      <TableCell>
                        {DateTime.fromISO(journal.createdAt).toLocaleString(
                          DateTime.DATE_MED
                        )}
                      </TableCell>
                      <TableCell>{journal.journalType.name}</TableCell>
                      <TableCell>{detail.coa?.code}</TableCell>
                      <TableCell>{detail.coa?.name}</TableCell>
                      <TableCell>
                        {detail.debit.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </TableCell>
                      <TableCell>
                        {detail.credit.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </TableCell>
                      <TableCell>
                        {DateTime.fromISO(journal.createdAt).toLocaleString(
                          DateTime.DATETIME_MED_WITH_WEEKDAY,
                          { locale: "id" }
                        )}
                      </TableCell>
                      <TableCell>{journal.user.fullName}</TableCell>
                      <TableCell>
                        {detail.note ?? '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                  {/* Totals Row */}
                  <TableRow className="bg-gray-100 font-bold">
                    <TableCell>Total</TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell className="font-bold">
                      {journal.creditTotal.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </TableCell>
                    <TableCell className="font-bold">
                      {journal.debtTotal.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                    <TableCell>
                      <span></span>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
        <div className="flex justify-between">
          <Pagination
            color="primary"
            total={journalData.data?.data?.meta?.totalPage || 1}
            initialPage={1}
            page={journalData.data?.data?.meta?.page || 1}
            onChange={(page) => setPage(page.toString())}
          />
        </div>
      </div>
    </div>
  );
}