"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import {useEffect, useMemo} from "react";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import { InputNumber } from "@/components/ui/input";
import { useGetInvestors } from "@/app/(authenticated)/_services/investor";
import { useCreatePenerimaanModal } from "@/app/(authenticated)/_services/penerimaan-modal";
import useLocationStore from "@/stores/useLocationStore";
import {getDateToday} from "@/libs/helper";
import {useGetListJournalType} from "@/app/(authenticated)/_services/journal-type";

export default function Page() {
  const schema = z.object({
    tanggal: z.string({
      message: "Mohon pilih tanggal",
    }),
    investorId: z.string({
      message: "Mohon pilih invesetor",
    }),
    siteId: z.string().optional(),
    cageId: z.string({
      message: "Mohon pilih Kandang",
    }),
    nominal: z.number({
      message: "Mohon isi data nominal",
    }),
    journalTypeId: z.string({
      message: "Mohon pilih journal type",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });
  
  const { siteId } = useLocationStore();
  
  const submission = useCreatePenerimaanModal();
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
  const jurnalTypes = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const investorData = useGetInvestors(useMemo(()=>({page:"1", limit:"10000"}),[]))
  

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          status: 1,
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/cash/penerimaan-modal");
        },
      }
    );
  });
  
  // useEffect for tanggal default value now
  useEffect(() => {
    const today = getDateToday();
    form.setValue("tanggal", today);
  }, [form]);
  
  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Modal</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="tanggal"
              render={({field, fieldState}) => (
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
              name="journalTypeId"
              render={({field, fieldState}) => (
                <Select
                  label="Journal Type"
                  placeholder="Pilih Journal Type"
                  variant="bordered"
                  labelPlacement="outside"
                  isLoading={jurnalTypes.isLoading}
                  {...field}
                  selectedKeys={[field.value]}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {jurnalTypes.data?.data?.data?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {
                        `${type.code} - ${type.name}`
                      }
                    </SelectItem>
                  )) ?? []}
                </Select>
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="investorId"
              render={({field, fieldState}) => (
                <Select
                  isLoading={investorData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Investor"
                  label="Investor"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
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
              render={({field, fieldState}) => (
                <Select
                  isLoading={siteData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  selectedKeys={[siteId as string]}
                  {...field}
                  aria-readonly={true}
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
              render={({field, fieldState}) => (
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
              name="nominal"
              render={({field, fieldState}) => (
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
