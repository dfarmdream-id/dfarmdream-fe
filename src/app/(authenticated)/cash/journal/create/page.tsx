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
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useGetListTemplateJournal } from "@/app/(authenticated)/_services/template-journal";
import { useCreateJournal } from "@/app/(authenticated)/_services/journal";

export default function Page() {
  const schema = z.object({
    code: z.string({ message: "Kode wajib diisi" }),
    date: z.string({ message: "Tanggal wajib diisi" }),
    debtTotal: z.number().optional(),
    creditTotal: z.number().optional(),
    status: z.string().optional(),
    journalTypeId: z.string().optional(),
    templateId: z.string().optional(),
    details: z
      .array(
        z.object({
          coaCode: z.number().optional(),
          coaName: z.string().optional(),
          debit: z.number({ message: "Nilai debit wajib diisi" }),
          credit: z.number({ message: "Nilai kredit wajib diisi" }),
          note: z.string().optional(),
        })
      )
      .nonempty("Harus menambahkan setidaknya satu detail"),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
    defaultValues: {
      details: [],
    },
  });

  const router = useRouter();
  const submission = useCreateJournal();
  const templates = useGetListTemplateJournal(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const onTemplateSelect = (templateId: string) => {
    const selectedTemplate = templates.data?.data?.data?.find(
      (template) => template.id === templateId
    );

    if (selectedTemplate) {
      const details = selectedTemplate.journalTemplateDetails.map((detail) => ({
        coaCode: detail.coa.code,
        coaName: detail.coa.name,
        debit: 0,
        credit: 0,
        note: "",
      })) as z.infer<typeof schema>["details"];

      form.setValue("journalTypeId", selectedTemplate.jurnalTypeId);
      form.setValue("details", details);
    }
  };

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
      .replace(/\D/g, "") // Hapus semua karakter non-digit
      .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Tambahkan titik setiap 3 angka
  };

  const parseRupiah = (value: string) => {
    return Number(value.replace(/\./g, "")) || 0; // Hapus semua titik dan konversi ke angka
  };

  const onSubmit = form.handleSubmit((data) => {
    const totals = calculateTotals();
    
    console.log(data);

    if (totals.debitTotal !== totals.creditTotal) {
      toast.error("Total debit dan kredit harus seimbang");
      return;
    }

    submission.mutate(
      { body: { ...{
            ...data,
            status: "1"
          }, ...totals } },
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

  const totals = calculateTotals();
  
  const generateJournalCode = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `J${year}${month.toString().padStart(2, "0")}${day.toString().padStart(2, "0")}`;
  }

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Input Jurnal</div>
      <div>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="h-16">
              <Controller
                control={form.control}
                name="code"
                render={({ field, fieldState }) => (
                  <Input
                    label="Kode"
                    placeholder="Masukkan kode jurnal"
                    variant="bordered"
                    labelPlacement="outside"
                    defaultValue={generateJournalCode()}
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                  />
                )}
              />
            </div>
            <div className="h-16">
              <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => (
                  <Input
                    type="date"
                    label="Tanggal"
                    variant="bordered"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    labelPlacement="outside"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                  />
                )}
              />
            </div>
            <div className="h-16">
              <Controller
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <Select
                    variant="bordered"
                    labelPlacement="outside"
                    label="Tipe Jurnal"
                    placeholder="Pilih Tipe Jurnal"
                    isLoading={templates.isLoading}
                    onChange={(value) => {
                      field.onChange(value);
                      onTemplateSelect(value.target.value);
                    }}
                  >
                    {templates.data?.data?.data.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {`${template.code} - ${template.name}`}
                      </SelectItem>
                    )) ?? []}
                  </Select>
                )}
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableColumn>Account Code</TableColumn>
              <TableColumn>Account</TableColumn>
              <TableColumn>Debit</TableColumn>
              <TableColumn>Credit</TableColumn>
              <TableColumn>Note</TableColumn>
            </TableHeader>
            <TableBody>
              {form.watch("details").map((detail, index) => (
                <TableRow key={index}>
                  <TableCell>{detail.coaCode}</TableCell>
                  <TableCell>{detail.coaName}</TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatRupiah(detail.debit.toString())}
                      onChange={(e) =>
                        form.setValue(
                          `details.${index}.debit`,
                          parseRupiah(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="text"
                      value={formatRupiah(detail.credit.toString())}
                      onChange={(e) =>
                        form.setValue(
                          `details.${index}.credit`,
                          parseRupiah(e.target.value)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      placeholder="Catatan"
                      value={detail.note}
                      onChange={(e) =>
                        form.setValue(`details.${index}.note`, e.target.value)
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="text-right mt-3">
            <div>Total Debit: {formatRupiah(totals.debitTotal.toString())}</div>
            <div>Total Credit: {formatRupiah(totals.creditTotal.toString())}</div>
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
    </div>
  );
}
