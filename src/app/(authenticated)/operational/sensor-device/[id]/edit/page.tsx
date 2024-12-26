"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  useGetIotDevices,
} from "../../../../_services/iot-device";
import { useGetSensorDevice, useUpdateSensorDevice } from "@/app/(authenticated)/_services/sensor-device";

export default function Page() {
  const schema = z.object({
    code: z.string({
      message: "Mohon isi dengan kode perangkat IOT",
    }),
    type: z.string({
      message: "Pilih tipe sensor",
    }),
    deviceId: z.string({
      message: "Pilih perangkat",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateSensorDevice();
  const router = useRouter();
  const params = useParams();

  const item = useGetSensorDevice(useMemo(() => params.id as string, [params.id]));

  const devices = useGetIotDevices(
    useMemo(() => ({ page: "1", limit: "1000000" }), [])
  );

  useEffect(() => {
    if (item.data) {
      if (item?.data?.data?.code) {
        form.setValue("code", item?.data?.data?.code);
      }
      if (item?.data?.data?.type) {
        form.setValue("type", item?.data?.data?.type);
      }
      if (item?.data?.data?.deviceId) {
        form.setValue("deviceId", item?.data?.data?.deviceId);
      }
    }
  }, [item.data, form]);


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
          router.push("/operational/sensor-device");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Perangkat IOT</div>
      <div>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="h-16">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="CODE Sensor"
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
              name="deviceId"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Perangkat IOT"
                  label="Perangkat IOT"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
                >
                  {devices.data?.data?.data?.map((position) => (
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
              name="type"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Tipe Sensor"
                  label="Tipe Sensor"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
                >
                  <SelectItem key="TEMP" value="TEMP">
                    Temperature
                  </SelectItem>
                  <SelectItem key="HUMIDITY" value="HUMIDITY">
                    Kelembapan
                  </SelectItem>
                  <SelectItem key="GAS" value="GAS">
                    Amonia
                  </SelectItem>
                  <SelectItem key="LDR" value="LDR">
                    LDR
                  </SelectItem>
                </Select>
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button
              variant="bordered"
              color="primary"
              onClick={() => router.push("/operational/sensor-device")}
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
