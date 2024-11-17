"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useGetSites } from "../../_services/site";
import { InputNumber } from "@/components/ui/input";
import { useCreateCage } from "../../_services/cage";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "ID wajib diisi",
    }),
    siteId: z.string({
      message: "Password wajib diisi",
    }),
    width: z.number({
      message: "Lebar wajib diisi",
    }),
    height: z.number({
      message: "Tinggi wajib diisi",
    }),
    capacity: z.number({
      message: "Kapasitas wajib diisi",
    }),
  });

  const sites = useGetSites(useMemo(() => ({ page: "1", limit: "100" }), []));
  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateCage();
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
          router.push("/master/cages");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Kandang</div>
      <div>
        <form onSubmit={onSubmit}>
          <div className="h-16">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="ID Kandang"
                  placeholder="ID Kandang"
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
              name="width"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Lebar Kandang"
                  placeholder="Lebar Kandang"
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
              name="height"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Tinggi Kandang"
                  placeholder="Tinggi Kandang"
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
              name="capacity"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Kapasitas Kandang"
                  placeholder="Kapasitas Kandang"
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

          <div className="mt-5 flex gap-3 justify-end">
            <Button variant="bordered" color="primary">
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
