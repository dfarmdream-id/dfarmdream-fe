"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetCageRack, useUpdateCageRack } from "../../../../_services/rack";
import { useRouter } from "next/navigation";
import { useGetCages } from "../../../../_services/cage";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama wajib diisi",
    }),
    cageId: z.string({
      message: "Id kandang",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateCageRack();
  const router = useRouter();
  const params = useParams();
  const cage = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));

  const data = useGetCageRack(useMemo(() => params.id as string, [params.id]));

  useEffect(() => {
    if (data.data) {
      if (data?.data?.data?.name) {
        form.setValue("name", data?.data?.data?.name);
      }
      if (data?.data?.data?.cageId) {
        form.setValue("cageId", data?.data?.data?.cageId);
      }
    }
  }, [data.data, form]);

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
          router.push("/operational/cages");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Pengguna</div>
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
                  variant="bordered"
                  isLoading={cage.isLoading}
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
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
