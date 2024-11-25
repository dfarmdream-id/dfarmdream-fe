"use client";
import {
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useGetCages } from "../../../_services/cage";
import { useCreateCageRack } from "../../../_services/rack";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama wajib diisi",
    }),
    cageId: z.string({
      message: "Id kandang",
    }),
  });

  const cage = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));
  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateCageRack();
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
          router.push("/operational/cage-racks");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Rak</div>
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
                  label="ID Rak"
                  placeholder="ID Rak"
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
                  isLoading={cage.isLoading}
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {cage.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end">
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
