"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import {  useGetListKategoriBiaya } from "@/app/(authenticated)/_services/kategori-biaya";
import { useGetBiaya, useUpdateBiaya } from "@/app/(authenticated)/_services/biaya";
import { useGetUsers } from "@/app/(authenticated)/_services/user";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import { InputNumber } from "@/components/ui/input";

export default function Page() {
  const schema = z.object({
    tanggal: z.string({
      message: "Mohon pilih tanggal",
    }),
    siteId: z.string({
      message: "Mohon pilih lokasi",
    }),
    cageId: z.string({
      message: "Mohon pilih Kandang",
    }),
    kategoriId: z.string({
      message: "Kategori id tidak boleh dikosongkan",
    }),
    userId: z.string({
      message: "Mohon pilih karyawan",
    }),
    biaya: z.number({
      message: "Mohon isi data biaya",
    }),
    keterangan: z.string({
      message: "Mohon isi data biaya",
    }).optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateBiaya();
  const router = useRouter();
  const params = useParams();

  const position = useGetBiaya(
    useMemo(() => params.id as string, [params])
  );

  const watch = form.watch();
  const kategoriData = useGetListKategoriBiaya(
    useMemo(() => ({ page: "1", limit: "1000" }), [])
  );
  const siteData = useGetSites(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: watch.siteId }),
      [watch.siteId]
    )
  );
  const userData = useGetUsers(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("tanggal", position?.data?.data?.tanggal);
      form.setValue("siteId", position?.data?.data?.siteId);
      form.setValue("cageId", position?.data?.data?.cageId);
      form.setValue("kategoriId", position?.data?.data?.kategoriId);
      form.setValue("userId", position?.data?.data?.userId);
      form.setValue("biaya", position?.data?.data?.biaya);
      form.setValue("keterangan", position?.data?.data?.keterangan);
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
          router.push("/cash/biaya");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Biaya</div>
      <div>
      <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="tanggal"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="date"
                  label="Tanggal"
                  placeholder="Tanggal"
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
              name="kategoriId"
              render={({ field, fieldState }) => (
                <Select
                  multiple
                  isLoading={kategoriData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kategori"
                  label="Kategori"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectionMode="multiple"
                >
                  {kategoriData.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.namaKategori}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="siteId"
              render={({ field, fieldState }) => (
                <Select
                  multiple
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
                  multiple
                  isLoading={cagesData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectionMode="multiple"
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
              name="userId"
              render={({ field, fieldState }) => (
                <Select
                  multiple
                  isLoading={userData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Karyawan"
                  label="Karyawan"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectionMode="multiple"
                >
                  {userData.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.fullName}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

            <div className="h-16 mt-2">
              <Controller
                control={form.control}
                name="biaya"
                render={({ field, fieldState }) => (
                  <InputNumber
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    label="Biaya"
                    placeholder="Ketikkan biaya"
                    startContent="Rp. "
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
                name="keterangan"
                render={({ field, fieldState }) => (
                  <Input
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
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
