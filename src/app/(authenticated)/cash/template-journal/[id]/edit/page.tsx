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
  Spinner, AutocompleteItem, Autocomplete,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter, useParams } from "next/navigation";
import { useGetTemplateJournal, useUpdateTemplateJournal } from "@/app/(authenticated)/_services/template-journal";
import { useEffect, useMemo } from "react";
import { useGetListJournalType } from "@/app/(authenticated)/_services/journal-type";
import {useGetListCOA} from "@/app/(authenticated)/_services/coa";

export default function Page() {
  const schema = z.object({
    name: z.string({ message: "Nama wajib diisi" }),
    code: z.string({ message: "Kode wajib diisi" }),
    status: z.string({ message: "Status wajib diisi" }),
    journalTypeId: z.string({ message: "Journal Type wajib diisi" }),
    details: z
      .array(
        z.object({
          id: z.string().optional(),
          coaCode: z.string({ message: "COA wajib diisi" }),
          status: z.string({ message: "Status wajib diisi" }),
          typeLedger: z.enum(["DEBIT", "CREDIT"], {
            message: "Type Ledger harus DEBIT atau CREDIT",
          }),
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
  const params = useParams();
  const submission = useUpdateTemplateJournal(
    useMemo(() => params.id as string, [params])
  );
  const jurnalTypes = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  const coas = useGetListCOA(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const { data: templateJournal, isLoading: isLoadingTemplate } = useGetTemplateJournal(
    useMemo(() => params.id as string, [params])
  );

  // Populate form with fetched data
  useEffect(() => {
    if (templateJournal) {
      const {
        name,
        code,
        status,
        jurnalType,
        journalTemplateDetails,
      } = templateJournal.data;

      // Konversi journalTemplateDetails ke format yang sesuai dengan schema
      const details = journalTemplateDetails.map((detail) => ({
        id: detail.id,
        coaCode: detail.coa?.code.toString() || "", // Pastikan `coa.code` selalu ada atau default menjadi ""
        status: detail.status,
        typeLedger: detail.typeLedger as "DEBIT" | "CREDIT", // Sesuaikan dengan enum
      })) as z.infer<typeof schema>["details"];

      // Set nilai pada form
      form.setValue("name", name);
      form.setValue("code", code);
      form.setValue("status", status);
      form.setValue("journalTypeId", jurnalType.id);
      form.setValue("details", details);
    }
  }, [templateJournal, form]);

  const onAddDetail = () => {
    form.setValue("details", [
      ...form.getValues("details"),
      { coaCode: "", status: "1", typeLedger: "DEBIT" },
    ]);
  };

  const onRemoveDetail = (index: number) => {
    const currentDetails = form.getValues("details");
    currentDetails.splice(index, 1);
    form.setValue("details", currentDetails);
  };

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          details: data.details.map((detail) => ({
            coaCode: Number(detail.coaCode),
            status: detail.status,
            typeLedger: detail.typeLedger,
          })),
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message || "Gagal memperbarui data");
        },
        onSuccess: () => {
          toast.success("Berhasil memperbarui data");
          form.reset();
          router.push("/cash/template-journal");
        },
      }
    );
  });

  // set value name from journalTypeId
  const journalTypeId = form.watch("journalTypeId");

  const journalType = jurnalTypes.data?.data?.data?.find(
    (type) => type.id === journalTypeId
  );

  useEffect(() => {
    if (journalType) {
      form.setValue("name", journalType.name);
    }
  }, [journalType]);

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Edit Template Journal</div>
      <div>
        {isLoadingTemplate ? (
          <Spinner />
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="h-16">
                <Controller
                  control={form.control}
                  name="journalTypeId"
                  render={({ field, fieldState }) => (
                    <Select
                      label="Journal Type"
                      placeholder="Pilih Journal Type"
                      variant="bordered"
                      labelPlacement="outside"
                      isLoading={jurnalTypes.isLoading}
                      {...field}
                      selectedKeys={[field.value]}
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                    >
                      {jurnalTypes.data?.data?.data?.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      )) ?? []}
                    </Select>
                  )}
                />
              </div>
              <div className="h-16">
                <Controller
                  control={form.control}
                  name="name"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Nama"
                      disabled
                      placeholder="Masukkan nama template"
                      variant="bordered"
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
                  name="code"
                  render={({ field, fieldState }) => (
                    <Input
                      label="Kode"
                      placeholder="Masukkan kode template"
                      variant="bordered"
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
                  name="status"
                  render={({ field, fieldState }) => (
                    <Select
                      label="Status"
                      placeholder="Pilih status"
                      {...field}
                      variant="bordered"
                      selectedKeys={[field.value]}
                      labelPlacement="outside"
                      errorMessage={fieldState.error?.message}
                      isInvalid={fieldState.invalid}
                    >
                      <SelectItem key="1" value="1">
                        Aktif
                      </SelectItem>
                      <SelectItem key="0" value="0">
                        Tidak Aktif
                      </SelectItem>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div>
              <div className="mb-3">
                <Button color="primary" onClick={onAddDetail}>
                  Tambah Detail COA
                </Button>
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[1000px] w-full">
                  <TableHeader>
                    <TableColumn>COA</TableColumn>
                    <TableColumn>Type Ledger</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Aksi</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {form.watch("details").map((detail, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Autocomplete
                            className="w-full"
                            defaultItems={coas.data?.data?.data.map((coa) => ({
                              key: coa.code,
                              label: `${coa.code}: ${coa.name}`,
                            }))}
                            defaultSelectedKey={detail.coaCode}
                            placeholder="Search COA"
                            onSelectionChange={(value): void => {
                              console.log(value);
                              form.setValue(`details.${index}.coaCode`, value?.toString() ?? "");
                            }}
                          >
                            {(item) => (
                              <AutocompleteItem value={item.key} key={item.key}>
                                {item.label}
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        </TableCell>
                        <TableCell>
                          <Select
                            variant="bordered"
                            labelPlacement="outside"
                            selectedKeys={[detail.typeLedger]}
                            onChange={(value) =>
                              form.setValue(
                                `details.${index}.typeLedger`,
                                value.target.value as "DEBIT" | "CREDIT"
                              )
                            }
                          >
                            <SelectItem key="DEBIT" value="DEBIT">
                              DEBIT
                            </SelectItem>
                            <SelectItem key="CREDIT" value="CREDIT">
                              CREDIT
                            </SelectItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select
                            labelPlacement="outside"
                            variant="bordered"
                            selectedKeys={[detail.status]}
                            onChange={(value) =>
                              form.setValue(`details.${index}.status`, value.target.value)
                            }
                          >
                            <SelectItem key="1" value="1">
                              Aktif
                            </SelectItem>
                            <SelectItem key="0" value="0">
                              Tidak Aktif
                            </SelectItem>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button
                            color="danger"
                            variant="bordered"
                            onClick={() => onRemoveDetail(index)}
                          >
                            Hapus
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="bordered" onClick={() => router.back()}>
                Kembali
              </Button>
              <Button
                color="primary"
                type="submit"
                isDisabled={submission.isPending}
                startContent={submission.isPending && <Spinner size="sm" />}
              >
                {submission.isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
