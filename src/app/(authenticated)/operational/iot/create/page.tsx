"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { InputNumber } from "@/components/ui/input";
import { useGetCages } from "../../../_services/cage";
import { useCreateIotDevice } from "../../../_services/iot-device";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Mohon isi dengan nama perangkat",
    }),
    code: z.string({
      message: "Mohon isi dengan kode perangkat IOT",
    }),
    cageId: z.string({
      message: "Pilih kandang terlebih dahulu",
    }),
    tempMinThreshold: z.number({message:"Mohon isi minimum temperature"}),
    humidityMinThreshold:z.number({message:"Mohon isi minimum humidity"}),
    amoniaMinThreshold:z.number({message:"mohon isi minimum amonia"}),
    tempThreshold: z.number({
      message: "Isi Temperature Threshold",
    }),
    humidityThreshold: z.number({
      message: "Isi humidity Threshold",
    }),
    amoniaThreshold: z.number({
      message: "Isi Amonia Threshold",
    }),
    ldrThreshold: z.number({
      message: "Isi LDR Threshold",
    })
  });

  const sites = useGetCages(useMemo(() => ({ page: "1", limit: "1000000" }), []));
  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateIotDevice();
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
          router.push("/operational/iot");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data IOT</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Kode Perangkat"
                  placeholder="Masukkan kode yang tertera pada perangkat"
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
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Perangkat"
                  placeholder="Masukkan Nama Perangkat"
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
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {sites.data?.data?.data?.map((position) => (
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
              name="tempMinThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Min Temperature Threshold"
                  placeholder="Ketikkan Min threshold suhu"
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
              name="tempThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Temperature Threshold"
                  placeholder="Ketikkan threshold suhu"
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
              name="humidityMinThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Min Humidity Threshold"
                  placeholder="Min Humidity Threshold"
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
              name="humidityThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Humidity Threshold"
                  placeholder="Threshold Humidity"
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
              name="amoniaMinThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Amonia Min Threshold"
                  placeholder="Ketikkan Min Threshold Amonia"
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
              name="amoniaThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Amonia Threshold"
                  placeholder="Ketikkan Threshold Amonia"
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
              name="ldrThreshold"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="LDR Threshold"
                  placeholder="Ketikkan threshold LDR"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>
          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button variant="bordered" color="primary" onClick={()=>router.push("/operational/iot")}>
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
