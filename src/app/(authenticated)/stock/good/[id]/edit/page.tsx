"use client";
import { Button, Input,  Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {useGetGood, useUpdateGood} from "@/app/(authenticated)/_services/good";

export default function Page() {
  const schema = z.object({
    sku: z.string({
      message: "SKU Barang Wajib Diisi",
    }),
    name: z.string({
      message: "Nama barang wajib diisi",
    }),
    type: z.string({
      message: "Mohon pilih tipe barang",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateGood();
  const router = useRouter();
  const params = useParams();

  const position = useGetGood(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("name", position?.data?.data?.name);
      form.setValue("sku", position?.data?.data?.sku);
      form.setValue("type", position?.data?.data?.type);
    }
  }, [position.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
          ...data
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/stock/good");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Kategori Biaya</div>
      <div>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
        <div className="h-16">
          <Controller
            control={form.control}
            name="sku"
            render={({field, fieldState}) => (
              <Input
                labelPlacement="outside"
                variant="bordered"
                type="text"
                label="SKU Barang"
                placeholder="SKU Barang"
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
            name="name"
            render={({field, fieldState}) => (
              <Input
                labelPlacement="outside"
                variant="bordered"
                type="text"
                label="Nama Barang"
                placeholder="Nama Barang"
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
            name="type"
            render={({field, fieldState}) => (
              <Select
                labelPlacement="outside"
                placeholder="Pilih Tipe Barang"
                label="Tipe Barang"
                variant="bordered"
                {...field}
                defaultSelectedKeys={[
                  (form.watch("type") || position?.data?.data?.type) as string,
                ]}
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
