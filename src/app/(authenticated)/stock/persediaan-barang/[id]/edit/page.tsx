"use client";
import {Autocomplete, AutocompleteItem, Button, Select, SelectItem} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { InputNumber } from "@/components/ui/input";

import { useGetPersediaanBarang, useUpdatePersediaanBarang } from "@/app/(authenticated)/_services/persediaan-barang";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import {useGetListGood} from "@/app/(authenticated)/_services/good";

export default function Page() {
  const schema = z.object({
    goodId: z.string({
      message: "Barang Wajib Diisi",
    }),
    qty: z.number({
      message: "Jumlah barang wajib diisi",
    }),
    harga: z.number({
      message: "Harga barang wajib diisi",
    }),
    tipeBarang: z.string({
      message: "Mohon pilih tipe barang",
    }),
    siteId: z.string({
      message: "Mohon pilih lokasi",
    }),
    cageId: z.string({
      message: "Mohon pilih kandang",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdatePersediaanBarang();
  const router = useRouter();
  const params = useParams();

  const position = useGetPersediaanBarang(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("goodId", position?.data?.data?.goods?.id);
      form.setValue("qty", position?.data?.data?.qty);
      form.setValue("harga", position?.data?.data?.harga);
      form.setValue("tipeBarang", position?.data?.data?.goods?.type);
      form.setValue("siteId", position?.data?.data?.siteId);
      form.setValue("cageId", position?.data?.data?.cageId);
    }
  }, [position.data, form]);

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

  const goods = useGetListGood(
    useMemo(
      () => ({ q: "", page: "1", limit: "10000", }),
      []
    )
  );

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
          ...data,
          status:1,
          tipeBarang:data.tipeBarang.toUpperCase()??''
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/stock/persediaan-barang");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Persediaan Barang</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="siteId"
              render={({field, fieldState}) => (
                <Select
                  isLoading={siteData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
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
              render={({field, fieldState}) => (
                <Select
                  multiple
                  isLoading={cagesData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
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
              name="goodId"
              render={({field, fieldState}) => (
                <Autocomplete
                  isLoading={goods.isLoading}
                  label="Barang"
                  items={goods.data?.data?.data ?? []} // Use an empty array as fallbac
                  placeholder="Pilih Barang"
                  variant="bordered"
                  labelPlacement="outside"
                  onSelectionChange={(item) => {
                    form.setValue("goodId", item?.toString() ?? "");
                  }}
                  {...field}
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                >
                  {(user) => (
                    <AutocompleteItem key={user.id} textValue={user.name}>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">{user.name}</span>
                          <span className="text-tiny text-default-400">{user.sku}</span>
                        </div>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="tipeBarang"
              render={({field, fieldState}) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Tipe Barang"
                  label="Tipe Barang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
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

          <div className="h-16">
            <Controller
              control={form.control}
              name="qty"
              render={({field, fieldState}) => (
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

          <div className="h-16 mt-2">
            <Controller
              control={form.control}
              name="harga"
              render={({field, fieldState}) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Harga"
                  placeholder="Ketikkan Harga Barang"
                  startContent="Rp. "
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
