"use client";
import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateCashFlowCategory } from "../../../_services/cashflow-category";
import {useGetSites} from "@/app/(authenticated)/_services/site";
import {useMemo} from "react";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama jabatan wajib diisi",
    }),
    siteId: z.string({
      message: "Lokasi wajib diisi",
    })
  });

  const sites = useGetSites(useMemo(() => ({ page: "1", limit: "100" }), []));
  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateCashFlowCategory();
  const router = useRouter();

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/cash/category");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">
        Tambah Data Kategori Arus Kas
      </div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="name"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Kategori Arus Kas"
                  placeholder="Kategori Arus Kas"
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
              render={({field, fieldState}) => (
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
