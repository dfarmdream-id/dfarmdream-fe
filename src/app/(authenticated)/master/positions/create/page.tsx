"use client";
import { Button, Input, Switch } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreatePosition } from "../../../_services/position";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama jabatan wajib diisi",
    }),
    checkinTime: z.string({
      message: "Checkin Time wajib diisi",
    }),
    checkKandang:z.boolean({
      message:"Mohon isi check kandang"
    }),
    checkoutTime: z.string({
      message: "Checkout Time wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
    defaultValues:{
      checkKandang:false
    }
  });

  const submission = useCreatePosition();
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
          router.push("/master/positions");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Pengguna</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
