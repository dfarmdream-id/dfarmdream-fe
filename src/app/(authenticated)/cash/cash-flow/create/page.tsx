"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetCashFlowCategories } from "../../../_services/cashflow-category";
import { InputNumber } from "@/components/ui/input";
import { useMemo } from "react";
import { useGetCages } from "../../../_services/cage";
import { useCreateCashFlow } from "../../../_services/cash-flow";

export default function Page() {
  const schema = z.object({
    amount: z.number({
      message: "Jumlah wajib diisi",
    }),
    type: z.string({
      message: "Jenis wajib diisi",
    }),
    name: z.string({
      message: "Arus Kas wajib diisi",
    }),
    categoryId: z.string({
      message: "Kategori wajib diisi",
    }),
    cageId: z.string({
      message: "Kandang wajib diisi",
    }),
    remark: z.string(),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateCashFlow();
  const router = useRouter();
  const cage = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));
  const category = useGetCashFlowCategories(
    useMemo(() => ({ page: "1", limit: "100" }), [])
  );

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
          router.push("/cash/cash-flow");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Arus Kas</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="type"
              render={({ field, fieldState }) => (
                <Select
                  label="Jenis Arus Kas"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Pilih Jenis Arus Kas"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  <SelectItem key="INCOME">Pemasukan</SelectItem>
                  <SelectItem key="EXPENSE">Pengeluaran</SelectItem>
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
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Penggunaan"
                  placeholder="Nama Penggunaan"
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
              name="categoryId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={category.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kategori Kas"
                  label="Kategori Kas"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {category.data?.data?.data?.map((item) => (
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
              name="amount"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Total"
                  placeholder="Total"
                  startContent="Rp. "
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
              name="remark"
              render={({ field, fieldState }) => (
                <Textarea
                  labelPlacement="outside"
                  variant="bordered"
                  label="Keterangan"
                  placeholder="Keterangan"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
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
