"use client";
import { Button, Input } from "@nextui-org/react";
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
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
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
      <div className="text-2xl font-bold mb-10">Ubah Jabatan</div>
      <div>
        <form onSubmit={onSubmit}>
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

          <div className="mt-5 flex gap-3 justify-end">
            <Button variant="bordered" color="primary">
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
