"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useCreateDocumentInvestment } from "@/app/(authenticated)/_services/document-investment";
import { InputNumber } from "@/components/ui/input";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useMemo } from "react";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import UploadFile from "@/components/ui/upload-file";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama Investasi wajib diisi",
    }),
    cageId: z.string({
      message: "Kandang wajib diisi",
    }),
    amount: z.number({
      message: "Jumlah Investasi wajib diisi",
    }),
    siteId: z.string({
      message: "Lokasi wajib diisi",
    }),
    fileId: z.string({
      message: "File wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateDocumentInvestment();
  const router = useRouter();
  const params = useParams();
  const sites = useGetSites(
    useMemo(
      () => ({
        q: "",
        page: "1",
        limit: "1000",
      }),
      []
    )
  );
  const siteId = form.watch("siteId");
  const cage = useGetCages(
    useMemo(
      () => ({
        q: "",
        page: "1",
        limit: "1000",
        siteId,
      }),
      [siteId]
    )
  );

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          investorId: params.id as string,
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.back();
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Dokumen Investasi</div>
      <div>
        <form onSubmit={onSubmit} className=" flex flex-col gap-5">
          <div>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  variant="bordered"
                  labelPlacement="outside"
                  label="Nama Investasi"
                  placeholder="Nama Investasi"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>
          <div>
            <Controller
              control={form.control}
              name="amount"
              render={({ field, fieldState }) => (
                <InputNumber
                  variant="bordered"
                  type="number"
                  labelPlacement="outside"
                  label="Jumlah Investasi"
                  placeholder="Jumlah Investasi"
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
              name="siteId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={sites.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {sites.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>
          <div className="h-16">
            <Controller
              control={form.control}
              name="cageId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={cage.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {cage.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          <div>
            <Controller
              control={form.control}
              name="fileId"
              render={({ field }) => <UploadFile {...field} />}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button
              variant="bordered"
              color="primary"
              onClick={() => router.back()}
            >
              Kembali
            </Button>
            <Button
              isLoading={submission.isPending}
              color="primary"
              type="submit"
            >
              Simpan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
