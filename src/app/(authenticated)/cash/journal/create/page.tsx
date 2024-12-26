"use client";

import {
  Button,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import {useRouter, useSearchParams} from "next/navigation";
import {useEffect, useMemo} from "react";
import { useCreateJournal } from "@/app/(authenticated)/_services/journal";
import { useGetListCOA } from "@/app/(authenticated)/_services/coa";
import {useGetListJournalType} from "@/app/(authenticated)/_services/journal-type";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import useBatchStore from "@/stores/useBatchStore";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";

export default function Page() {
  
  const schema = z.object({
    code: z.string({ message: "Kode wajib diisi" }),
    date: z.string({ message: "Tanggal wajib diisi" }),
    debtTotal: z.number().optional(),
    creditTotal: z.number().optional(),
    status: z.string().optional(),
    journalTypeId: z.string().optional(),
    cageId: z.string().optional(),
    batchId: z.string().optional(),
    details: z
      .array(
        z.object({
          coaCode: z.string(),
          coaName: z.string().optional(),
          debit: z.number({ message: "Nilai debit wajib diisi" }),
          credit: z.number({ message: "Nilai kredit wajib diisi" }),
          note: z.string().optional(),
          typeLedger: z.string().optional(),
        })
      )
      .nonempty("Harus menambahkan setidaknya satu detail"),
  });
  
  // get param journalCode from url

  const form = useForm<z.infer<typeof schema>>({
    schema,
    defaultValues: {
      details: [],
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const journalCode = searchParams.get("journalCode")
  
  const submission = useCreateJournal();
  const journalType = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const coas = useGetListCOA(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  
  const { batchId } = useBatchStore();
  const {siteId} = useLocationStore();

  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "100", siteId: siteId ?? "" }),
      [siteId]
    )
  );

  const calculateTotals = () => {
    const details = form.watch("details");
    const debitTotal = details.reduce((sum, detail) => sum + detail.debit, 0);
    const creditTotal = details.reduce((sum, detail) => sum + detail.credit, 0);

    form.setValue("debtTotal", debitTotal);
    form.setValue("creditTotal", creditTotal);

    return { debitTotal, creditTotal };
  };

  const formatRupiah = (value: string) => {
    if (!value) return "";
    return value
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseRupiah = (value: string) => {
    return Number(value.replace(/\./g, "")) || 0;
  };

  const onSubmit = form.handleSubmit((data) => {
    const totals = calculateTotals();

    if (totals.debitTotal !== totals.creditTotal) {
      toast.error("Total debit dan kredit harus seimbang");
      return;
    }

    submission.mutate(
      {
        body: {
          ...data,
          status: "1",
          siteId,
          details: data.details.map((detail) => ({
            ...detail,
            coaCode: Number(detail.coaCode),
          })),
          ...totals, // Memastikan totals berada di luar details dan di dalam body
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message || "Gagal menyimpan data");
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/cash/journal");
        },
      }
    );
  });

  const onAddDetail = () => {
    form.setValue("details", [
      ...form.getValues("details"),
      {
        coaCode: "",
        coaName: "",
        debit: 0,
        credit: 0,
        note: "",
        typeLedger: "ALL",
      },
    ]);
  };

  const onRemoveDetail = (index: number) => {
    const details = form.getValues("details");
    details.splice(index, 1);
    form.setValue("details", details);
  };

  const onJournalTypeSelect = (journalTypeId: string) => {
    const selectedJournalType = journalType.data?.data?.data.find(
      (type) => type.id === journalTypeId
    );

    if (selectedJournalType?.JournalTemplate?.[0]) {
      const journalTemplateDetails =
        selectedJournalType.JournalTemplate[0].journalTemplateDetails.map(
          (detail) => ({
            coaCode: detail.coa.code.toString(),
            coaName: detail.coa.name,
            debit: detail.typeLedger === "DEBIT" ? 0 : 0,
            credit: detail.typeLedger === "CREDIT" ? 0 : 0,
            typeLedger: detail.typeLedger,
            note: "",
          })
        );

      form.setValue("details", journalTemplateDetails as z.infer<typeof schema>["details"]);
    } else {
      form.setValue("details", [
        {
          coaCode: "",
          coaName: "",
          debit: 0,
          credit: 0,
          note: "",
          typeLedger: "ALL",
        },
      ]); // Reset jika tidak ada JournalTemplate
    }

    form.setValue("journalTypeId", journalTypeId); // Set journalTypeId tetap
  };
  
  // useEffect to apply value code to journalCode, and date to current date
  useEffect(() => {
    form.setValue("code", journalCode ?? '-');
    form.setValue("date", new Date().toISOString().split("T")[0]);
  }, [journalCode]);

  useEffect(() => {
    if (batchId) {
      form.setValue("batchId", batchId);
    }
  }, [batchId]);

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Input Jurnal</div>
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            control={form.control}
            name="code"
            render={({ field, fieldState }) => (
              <Input
                label="Kode"
                placeholder="Masukkan kode jurnal"
                variant="bordered"
                labelPlacement="outside"
                {...field}
                errorMessage={fieldState.error?.message}
                isInvalid={fieldState.invalid}
              />
            )}
          />
          <Controller
            control={form.control}
            name="date"
            render={({ field, fieldState }) => (
              <Input
                type="date"
                label="Tanggal"
                variant="bordered"
                labelPlacement="outside"
                {...field}
                errorMessage={fieldState.error?.message}
                isInvalid={fieldState.invalid}
              />
            )}
          />
          

          <Controller
            control={form.control}
            name="cageId"
            render={({field, fieldState}) => (
              <Select
                multiple
                isLoading={cagesData.isLoading}
                labelPlacement="outside"
                placeholder="Pilih Kandang"
                label="Kandang "
                variant="bordered"
                {...field}
                errorMessage={fieldState.error?.message}
                isInvalid={fieldState.invalid}

              >
                {cagesData.data?.data?.data?.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                )) || []}
              </Select>
            )}
          />
          
            <FilterBatch label="Batch " onBatchIdChange={(value) => form.setValue("batchId", value)} batchId={form.watch("batchId")} />

          <Controller
            control={form.control}
            name="journalTypeId"
            render={() => (
              <Select
                variant="bordered"
                labelPlacement="outside"
                label="Tipe Jurnal"
                placeholder="Pilih Tipe Jurnal"
                isLoading={journalType.isLoading}
                onChange={(value) => onJournalTypeSelect(value.target.value)}
              >
                {journalType.data?.data?.data.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {
                      `${template.code} - ${template.name}`
                    }
                  </SelectItem>
                )) ?? []}
              </Select>
            )}
          />
        </div>
        <div>
          <div className="mb-3">
            <Button color="primary" onClick={onAddDetail}>
              Tambah Detail COA
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableColumn>Account Code</TableColumn>
              <TableColumn>Debit</TableColumn>
              <TableColumn>Credit</TableColumn>
              <TableColumn>Note</TableColumn>
              <TableColumn>Actions</TableColumn>
            </TableHeader>
            <TableBody>
              {form.watch("details").map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      variant="bordered"
                      labelPlacement="outside"
                      selectedKeys={[detail.coaCode]}
                      onChange={(value) =>
                        form.setValue(`details.${index}.coaCode`, value.target.value)
                      }
                    >
                      {coas.data?.data?.data.map((coa) => (
                        <SelectItem key={coa.code} value={coa.code}>
                          {
                            `${coa.code}: ${coa.name}`
                          }
                        </SelectItem>
                      )) ?? []}
                    </Select>
                  </TableCell>
                  <TableCell>
                    {
                      (detail.typeLedger === "DEBIT" || detail.typeLedger === "ALL") ? (
                        <Input
                          type="text"
                          value={formatRupiah(detail.debit.toString())}
                          onChange={(e) =>
                            form.setValue(`details.${index}.debit`, parseRupiah(e.target.value))
                          }
                        />
                      ) : (<div></div>)
                    }
                  </TableCell>
                  <TableCell>
                    {
                      (detail.typeLedger === "CREDIT" || detail.typeLedger === "ALL") ? (
                        <Input
                          type="text"
                          value={formatRupiah(detail.credit.toString())}
                          onChange={(e) =>
                            form.setValue(`details.${index}.credit`, parseRupiah(e.target.value))
                          }
                        />
                      ) : (<div></div>)
                    }
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Catatan"
                      value={detail.note}
                      onChange={(e) => form.setValue(`details.${index}.note`, e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Button color="danger" onClick={() => onRemoveDetail(index)}>
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="text-right mt-3">
          <div>Total Debit: {formatRupiah(calculateTotals().debitTotal.toString())}</div>
          <div>Total Credit: {formatRupiah(calculateTotals().creditTotal.toString())}</div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="bordered" onClick={() => router.back()}>
            Kembali
          </Button>
          <Button color="primary" type="submit">
            Simpan
          </Button>
        </div>
      </form>
    </div>
  );
}