"use client";
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InputNumber } from "@/components/ui/input";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import { useMemo } from "react";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import {
  useGetListPersediaanBarang,
} from "@/app/(authenticated)/_services/persediaan-barang";
import { useCreateTransaksiBarang } from "@/app/(authenticated)/_services/transaksi-barang";

export default function Page() {
  const schema = z.object({
    barangId: z.string({
      message: "Mohon pilih barang",
    }),
    siteId: z.string({
      message: "Mohon pilih lokasi",
    }),
    cageId: z.string({
      message: "Mohon pilih kandang",
    }),
    qty: z.number({
      message: "QTY",
    }),
    tipe: z.string({
      message: "Mohon pilih tipe",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateTransaksiBarang();
  const router = useRouter();

  const watch = form.watch();
  const siteData = useGetSites(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: watch.siteId }),
      [watch.siteId]
    )
  );

  const barangData = useGetListPersediaanBarang(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/stock/transaksi");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Persediaan Barang</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="siteId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={siteData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {siteData.data?.data?.data?.map((position) => (
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
                  isLoading={cagesData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
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
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="barangId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={barangData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Barang"
                  label="Barang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {barangData.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.namaBarang}
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
                  label="qty"
                  placeholder="Jumlah Barang"
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
              name="tipe"
              render={({ field, fieldState }) => (
                <RadioGroup
                  label="Tipe"
                  orientation="horizontal"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  <Radio value="in">IN</Radio>
                  <Radio value="out">OUT</Radio>
                </RadioGroup>
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
