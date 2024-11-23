"use client";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetChicken, useUpdateChicken } from "../../../_services/chicken";
import { useGetCageRacks } from "../../../_services/rack";

export default function Page() {
  const schema = z.object({
    rackId: z.string({
      message: "Rak wajib diisi",
    }),
    name: z.string({
      message: "Nama wajib diisi",
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
          router.push("/master/chickens");
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
                  multiple
                  labelPlacement="outside"
                  placeholder="Pilih Rak"
                  label="Rak"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectionMode="multiple"
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

          <div className="mt-5 flex gap-3 justify-end">
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
