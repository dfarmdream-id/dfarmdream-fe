"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { InputNumber } from "@/components/ui/input";
import { useGetCages } from "../../../../_services/cage";
import { useGetIotDevice, useUpdateIotDevice } from "../../../../_services/iot-device";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Mohon isi dengan nama perangkat IOT",
    }),
    code: z.string({
      message: "Mohon isi dengan kode perangkat IOT",
    }),
    cageId: z.string({
      message: "Pilih kandang terlebih dahulu",
    }),
    tempThreshold: z.number({
      message: "Isi Temperature Threshold",
    }),
    humidityThreshold: z.number({
      message: "Isi humidity Threshold",
    }),
    amoniaThreshold: z.number({
      message: "Isi Amonia Threshold",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateIotDevice();
  const router = useRouter();
  const params = useParams();

  const item = useGetIotDevice(useMemo(() => params.id as string, [params.id]));

  useEffect(() => {
    if (item.data) {
      if (item?.data?.data?.name) {
        form.setValue("name", item?.data?.data?.name);
      }
      if (item?.data?.data?.code) {
        form.setValue("code", item?.data?.data?.code);
      }
      if (item?.data?.data?.tempThreshold) {
        form.setValue("tempThreshold", item?.data?.data?.tempThreshold);
      }
      if (item?.data?.data?.humidityThreshold) {
        form.setValue(
          "humidityThreshold",
          item?.data?.data?.humidityThreshold || 0
        );
      }
      if (item?.data?.data?.amoniaThreshold) {
        form.setValue("amoniaThreshold", item?.data?.data?.amoniaThreshold);
      }
      if (item?.data?.data?.cageId) {
        form.setValue("cageId", item?.data?.data?.cageId);
      }
    }
  }, [item.data, form]);

  const sites = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: data,
        pathVars: {
          id: params.id as string,
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/operational/iot");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Kandang</div>
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
                  label="CODE Perangkat"
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
                  selectedKeys={[field.value]}
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
          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button variant="bordered" color="primary" onClick={()=> router.push('/operational/iot')}>
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
