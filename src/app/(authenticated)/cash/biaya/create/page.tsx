"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetListKategoriBiaya,
} from "@/app/(authenticated)/_services/kategori-biaya";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useMemo } from "react";
import { useGetUsers } from "@/app/(authenticated)/_services/user";
import { InputNumber } from "@/components/ui/input";
import { useCreateBiaya } from "@/app/(authenticated)/_services/biaya";
import useLocationStore from "@/stores/useLocationStore";

export default function Page() {
  const schema = z.object({
    tanggal: z.string({
      message: "Mohon pilih tanggal",
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

  // const watch = form.watch();

  const submission = useCreateBiaya();
  const router = useRouter();
  const {siteId} = useLocationStore();

  const kategoriData = useGetListKategoriBiaya(
    useMemo(() => ({ page: "1", limit: "1000" }), [])
  );
  // const siteData = useGetSites(
  //   useMemo(() => ({ page: "1", limit: "10000" }), [])
  // );
  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: siteId ?? "" }),
      [siteId]
    )
  );
  const userData = useGetUsers(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const onSubmit = form.handleSubmit((data) => {
    console.log("Disubmit")
    submission.mutate(
      {
        body: {
          ...data,
          status: 1,
          siteId: siteId
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/cash/biaya");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Biaya</div>
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

          {/*<div className="h-16">*/}
          {/*  <Controller*/}
          {/*    control={form.control}*/}
          {/*    name="siteId"*/}
          {/*    render={({ field, fieldState }) => (*/}
          {/*      <Select*/}
          {/*        multiple*/}
          {/*        isLoading={siteData.isLoading}*/}
          {/*        labelPlacement="outside"*/}
          {/*        placeholder="Pilih Lokasi"*/}
          {/*        label="Lokasi"*/}
          {/*        variant="bordered"*/}
          {/*        disabled={true}*/}
          {/*        defaultSelectedKeys={[siteId ?? ""]}*/}
          {/*        {...field}*/}
          {/*        errorMessage={fieldState.error?.message}*/}
          {/*        isInvalid={fieldState.invalid}*/}
          {/*      >*/}
          {/*        {siteData.data?.data?.data?.map((position) => (*/}
          {/*          <SelectItem key={position.id} value={position.id}>*/}
          {/*            {position.name}*/}
          {/*          </SelectItem>*/}
          {/*        )) || []}*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}

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
