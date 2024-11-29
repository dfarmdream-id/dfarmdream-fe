"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  useGetChicken,
  useUpdateChicken,
} from "@/app/(authenticated)/_services/chicken";
import { useGetCageRacks } from "@/app/(authenticated)/_services/rack";

export default function Page() {
  const schema = z.object({
    rackId: z.string({
      message: "Rak wajib diisi",
    }),
    name: z.string({
      message: "Nama wajib diisi",
    }),
    status: z.string({
      message: "Status wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateChicken();
  const router = useRouter();
  const params = useParams();

  const user = useGetChicken(useMemo(() => params.id as string, [params.id]));

  useEffect(() => {
    if (user.data) {
      if (user?.data?.data?.name) {
        form.setValue("name", user?.data?.data?.name);
      }
      if (user?.data?.data?.rackId) {
        form.setValue("rackId", user?.data?.data?.rackId);
      }
      if (user?.data?.data?.status) {
        form.setValue("status", user?.data?.data?.status);
      }
    }
  }, [user.data, form]);

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
          router.push("/operational/chickens");
        },
      }
    );
  });

  const racks = useGetCageRacks(
    useMemo(() => ({ page: "1", limit: "100" }), [])
  );

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Ayam</div>
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
            <Controller
              control={form.control}
              name="rackId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={racks.isLoading}
                  multiple
                  labelPlacement="outside"
                  placeholder="Pilih Rak"
                  label="Rak"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value as string]}
                >
                  {racks.data?.data?.data?.map((position) => (
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
              name="status"
              render={({ field }) => (
                <Select
                  variant="bordered"
                  label="Status Ayam"
                  placeholder="Pilih Status"
                  labelPlacement="outside"
                  {...field}
                  selectedKeys={[field.value as string]}
                >
                  <SelectItem key="ALIVE">Hidup</SelectItem>
                  <SelectItem key="DEAD">Mati</SelectItem>
                </Select>
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
