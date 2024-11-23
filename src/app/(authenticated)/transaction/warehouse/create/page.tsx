"use client";
import { Button, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { InputNumber } from "@/components/ui/input";
import { useCreateWarehouseTransaction } from "@/app/(authenticated)/_services/warehouse-transaction";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useGetCageRacks } from "@/app/(authenticated)/_services/rack";

export default function Page() {
  const schema = z.object({
    cageId: z.string({
      message: "Kandang wajib diisi",
    }),
    rackId: z.string({
      message: "Rak wajib diisi",
    }),
    qty: z.number({
      message: "Jumlah wajib diisi",
    }),
    weight: z.number({
      message: "Berat wajib diisi",
    }),
    type: z.string({
      message: "Jenis wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateWarehouseTransaction();
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
          router.push("/transaction/warehouse");
        },
      }
    );
  });

  const cage = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));
  const rack = useGetCageRacks(
    useMemo(() => ({ page: "1", limit: "100" }), [])
  );

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Transaksi Gudang</div>
      <div>
        <form onSubmit={onSubmit}>
          <div className="h-16">
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Select
                  placeholder="Pilih Jenis"
                  label="Jenis Transaksi"
                  variant="bordered"
                  labelPlacement="outside"
                  {...field}
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                >
                  <SelectItem key="IN">Masuk</SelectItem>
                  <SelectItem key="OUT">Keluar</SelectItem>
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
          <div className="h-16">
            <Controller
              control={form.control}
              name="rackId"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Rak"
                  label="Rak"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {rack.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="qty"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Jumlah"
                  placeholder="Jumlah"
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
              name="weight"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Berat kg"
                  placeholder="Berat kg"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end">
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
