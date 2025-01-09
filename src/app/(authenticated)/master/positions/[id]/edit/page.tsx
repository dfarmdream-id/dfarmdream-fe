"use client";
import { Button, Input, Switch } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import {
  useGetPosition,
  useUpdatePosition,
} from "../../../../_services/position";
import { useEffect, useMemo } from "react";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama jabatan wajib diisi",
    }),
    checkinTime: z.string({
      message: "Checkin Time wajib diisi",
    }),
    checkoutTime: z.string({
      message: "Checkout Time wajib diisi",
    }),
    checkKandang: z.boolean({
      message: "Check kandang wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdatePosition();
  const router = useRouter();
  const params = useParams();

  const position = useGetPosition(useMemo(() => params.id as string, [params]));

  useEffect(() => {
    if (position.data) {
      form.setValue("name", position?.data?.data?.name);
      if (position?.data?.data?.checkinTime) {
        const dateTimeString = position?.data?.data?.checkinTime;
        const timeString = dateTimeString.split("T")[1].substring(0, 5);
        form.setValue("checkinTime", timeString);
      }
      if (position?.data?.data?.checkoutTime) {
        const dateTimeString = position?.data?.data?.checkoutTime;
        const timeString = dateTimeString.split("T")[1].substring(0, 5);
        form.setValue("checkoutTime", timeString);
      }
      form.setValue("checkKandang", position?.data?.data?.checkKandang);
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
          router.push("/master/positions");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Jabatan</div>
      <div>
        <form
          onSubmit={onSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          <div className="h-16">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Jabatan"
                  placeholder="Nama Jabatan"
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
              name="checkinTime"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="time"
                  label="Jam Checkin"
                  placeholder="Jam Checkin"
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
              name="checkoutTime"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="time"
                  label="Checkout Time"
                  placeholder="Jam Checkout"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="h-16">
            <div className="text-sm mb-2">Check Kandang?</div>
            <Controller
              control={form.control}
              name="checkKandang"
              render={({ field }) => (
                <Switch
                  defaultChecked
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  Check Kandang
                </Switch>
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
