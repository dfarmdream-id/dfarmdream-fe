"use client";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateChicken } from "@/app/(authenticated)/_services/chicken";
import FilterRack from "@/app/(authenticated)/_components/filterRack";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";

export default function Page() {
  const schema = z.object({
    rackId: z.string({
      message: "Rak wajib diisi",
    }),
    name: z.string({
      message: "Nama wajib diisi",
    }),
    batchId: z.string({
        message: "Batch wajib diisi",
    }),
    createdAt: z.string({
      message: "Tanggal Dibuat wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
    defaultValues: {},
  });

  const submission = useCreateChicken();
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
          router.push("/operational/chickens");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Ayam</div>
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
                  label="ID Ayam"
                  placeholder="ID Ayam"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="h-16">
            <FilterBatch
              onBatchIdChange={(value) => {
                form.setValue("batchId", value);
              }}
            />
          </div>
          
          <div className="h-16">
            <FilterRack
              onRackIdChange={(rackId) => {
                form.setValue("rackId", rackId);
              }}
            />
          </div>
          
          <div>
            <Controller
              control={form.control}
              name="createdAt"
              defaultValue={
                new Date().toISOString().split("T")[0]
              }
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="date"
                  label="Tanggal Dibuat"
                  placeholder="Tanggal Dibuat"
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