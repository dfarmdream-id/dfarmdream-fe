"use client";
import {Button, Input, Select, SelectItem} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useGetKategoriBiaya, useUpdateKategoriBiaya } from "@/app/(authenticated)/_services/kategori-biaya";

export default function Page() {
  const schema = z.object({
    namaKategori: z.string({
      message: "Nama Kategori wajib diisi",
    }),
    kodeAkun: z.string({
        message: "Kode akun wajib diisi",
    }),
    goodType: z.string().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateKategoriBiaya();
  const router = useRouter();
  const params = useParams();

  const position = useGetKategoriBiaya(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("namaKategori", position?.data?.data?.namaKategori);
      form.setValue("kodeAkun", position?.data?.data?.kodeAkun);
      form.setValue("goodType", position?.data?.data?.goodType);
    }
  }, [position.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/cash/kategori-biaya");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Kategori Biaya</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="namaKategori"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Kategori"
                  placeholder="Ketikkan nama kategori"
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
              name="kodeAkun"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Kode Akun"
                  placeholder="Ketikkan kode akun.."
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
              name="goodType"
              render={({field, fieldState}) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Tipe Barang"
                  label="Tipe Barang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  <SelectItem key="PAKAN" value="PAKAN">
                    PAKAN
                  </SelectItem>
                  <SelectItem key="OBAT" value="OBAT">
                    OBAT
                  </SelectItem>
                  <SelectItem key="ASSET" value="ASSET">
                    ASSET
                  </SelectItem>
                </Select>
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button
              variant="bordered"
              color="primary"
              onPress={() => router.back()}
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
