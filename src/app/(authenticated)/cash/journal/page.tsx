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
  Spinner, DateRangePicker, SelectItem, Select,
} from "@nextui-org/react";
import {HiSearch} from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import {useMemo, Fragment, useRef, useState} from "react";
import Link from "next/link";
import { DateTime } from "luxon";
import { useGetListJournal } from "@/app/(authenticated)/_services/journal";
import { SingleJournalData } from "@/app/(authenticated)/_models/response/journal";
import {parseDate} from "@internationalized/date";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";
import SkeletonPagination from "@/components/ui/SkeletonPagination";

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
  const [cageId, setCageId] = useQueryState("cageId", { throttleMs: 1000 });
  const [batchId, setBatchId] = useQueryState("batchId", { throttleMs: 1000 });
  const [dateRange, setDateRange] = useState({
    start: parseDate(
      DateTime.now().minus({ days: 1 }).toISODate()
    ),
    end: parseDate(
      DateTime.now().plus({ days: 1 }).toISODate()
    ),
  });

  const journalData = useGetListJournal(
    useMemo(
      () => ({
        q: search || "",
        page: page || "1",
        limit: "10",
        ...(cageId ? { cageId } : {}),
        ...(batchId ? { batchId } : {}),
        ...(dateRange ? { dateRange } : {}),
      }),
      [search, page, cageId, batchId, dateRange]
    )
  );

    const rows: SingleJournalData[] = useMemo(() => {
    return journalData.data?.data?.data || [];
  }, [journalData.data]);

  const groupedRows = useMemo(() => {
    return groupByJournalId(rows);
  }, [rows]);
  
  const {siteId} = useLocationStore();

  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "100", siteId: siteId ?? "" }),
      [siteId]
    )
  );

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Jurnal</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Search and Filters */}
          <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
            {/* Search Input */}
            <Input
              variant="bordered"
              placeholder="Cari"
              value={search || ""}
              onValueChange={setSearch}
              endContent={<HiSearch/>}
              className="w-full md:w-64"
            />
            {/* Date Range Picker */}
            <div className="flex gap-3 w-full md:w-auto">
              <DateRangePicker
                ref={pickerRef}
                variant="bordered"
                value={dateRange}
                onChange={setDateRange}
                className="w-full md:w-auto"
              />
            </div>
            
            {/* Cage Selection */}
            <Select
              isLoading={cagesData.isLoading}
              labelPlacement="outside"
              placeholder="Pilih Kandang"
              variant="bordered"
              className="w-full md:w-60 lg:w-80"
              onChange={
                (value) => setCageId(value.target.value as string)
              }
            >
              {cagesData.data?.data?.data?.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              )) || []}
            </Select>

            {/* Filter Batch */}
            <FilterBatch disableLabel={true} onBatchIdChange={(value) => setBatchId(value)} className="w-full md:w-60 lg:w-80"/>
          </div>

          {/* Add Journal Button */}
          <div className="w-full md:w-auto mt-3 md:mt-0 flex justify-end">
            <Button
              as={Link}
              href={`/cash/journal/create/?journalCode=JN-${DateTime.now().toFormat("yy-MM")}-${(journalData.data?.data?.meta?.totalData ?? 1)
                .toString()
                .padStart(2, "0")}`}
              color="primary"
              startContent={<HiPlus/>}
              className="w-full md:w-auto"
            >
              Tambah Jurnal
            </Button>
          </div>
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
            loadingContent={<Spinner/>}
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
                          {locale: "id"}
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
                      {journal.debtTotal.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </TableCell>
                    <TableCell className="font-bold">
                      {journal.creditTotal.toLocaleString("id-ID", {
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
          {journalData.isLoading ? (
            <SkeletonPagination />
          ) : (
            <Pagination
              color="primary"
              total={journalData.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={journalData.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          )}
        </div>
      </div>
    </div>
  );
}
