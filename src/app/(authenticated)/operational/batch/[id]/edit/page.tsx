"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetBatch, useUpdateBatch } from "../../../../_services/batch";

enum BatchStatus {
  ONGOING = "ONGOING",
  COMPLETED = "COMPLETED",
  CLOSED = "CLOSED",
}

// Utility function to format ISO date to "YYYY-MM-DD"
const formatDateForInput = (isoDate?: string | null): string => {
  if (!isoDate) return ""; // Return empty string if isoDate is null or undefined
  const date = new Date(isoDate);
  return date.toISOString().split("T")[0]; // Extracts "YYYY-MM-DD"
};

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama Batch wajib diisi",
    }),
    startDate: z.string({
      message: "Tanggal Mulai wajib diisi",
    }),
    endDate: z.string().optional(),
    status: z.enum([BatchStatus.ONGOING, BatchStatus.COMPLETED, BatchStatus.CLOSED], {
      message: "Status wajib dipilih",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateBatch();
  const router = useRouter();
  const params = useParams();

  const batch = useGetBatch(useMemo(() => params.id as string, [params.id]));

  useEffect(() => {
    if (batch.data) {
      form.setValue("name", batch?.data?.data?.name || "");
      form.setValue(
        "startDate",
        batch?.data?.data?.startDate ? formatDateForInput(batch.data.data.startDate) : ""
      );
      form.setValue(
        "endDate",
        batch?.data?.data?.endDate ? formatDateForInput(batch.data.data.endDate) : ""
      );
      form.setValue("status", batch?.data?.data?.status || BatchStatus.ONGOING);
    }
  }, [batch.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          startDate: new Date(data.startDate).toISOString(), // Convert back to ISO format
          endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
        },
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
          router.push("/operational/batch");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Batch</div>
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
                  label="Nama Batch"
                  placeholder="Nama Batch"
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
              name="startDate"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="date"
                  label="Tanggal Mulai"
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
              name="endDate"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="date"
                  label="Tanggal Selesai (Opsional)"
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
              name="status"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Status"
                  label="Status Batch"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
                >
                  {Object.values(BatchStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button variant="bordered" color="primary" onClick={() => router.back()}>
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
