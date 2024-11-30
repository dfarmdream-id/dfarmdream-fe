"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import { InputNumber } from "@/components/ui/input";
import { useGetPenerimaanModal, useUpdatePenerimaanModal } from "@/app/(authenticated)/_services/penerimaan-modal";
import { useGetInvestors } from "@/app/(authenticated)/_services/investor";


export default function Page() {
  const schema = z.object({
    tanggal: z.string({
      message: "Mohon pilih tanggal",
    }),
    investorId: z.string({
      message: "Mohon pilih invesetor",
    }),
    siteId: z.string({
      message: "Mohon pilih lokasi",
    }),
    cageId: z.string({
      message: "Mohon pilih Kandang",
    }),
    nominal: z.number({
      message: "Mohon isi data nominal",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdatePenerimaanModal();
  const router = useRouter();
  const params = useParams();

  const position = useGetPenerimaanModal(
    useMemo(() => params.id as string, [params])
  );

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
  const investorData = useGetInvestors(useMemo(()=>({page:"1", limit:"10000"}),[]))

  useEffect(() => {
    if (position.data) {
      form.setValue("tanggal", position?.data?.data?.tanggal);
      form.setValue("siteId", position?.data?.data?.siteId);
      form.setValue("cageId", position?.data?.data?.cageId);
      form.setValue("investorId", position?.data?.data?.investorId);
      form.setValue("nominal", position?.data?.data?.nominal);
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
          router.push("/cash/penerimaan-modal");
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
              name="investorId"
              render={({ field, fieldState }) => (
                <Select
                  multiple
                  isLoading={investorData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Investor"
                  label="Investor"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectionMode="multiple"
                >
                  {investorData.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.fullName}
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

          
            <div className="h-16 mt-2">
              <Controller
                control={form.control}
                name="nominal"
                render={({ field, fieldState }) => (
                  <InputNumber
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    label="Nominal"
                    placeholder="Ketikkan Nominal"
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
