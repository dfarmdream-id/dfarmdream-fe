"use client";
import { Button, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { useGetCageRacks } from "@/app/(authenticated)/_services/rack";
import { useCreateChicken } from "@/app/(authenticated)/_services/chicken";

export default function Page() {
  const schema = z.object({
    rackId: z.string({
      message: "Rak wajib diisi",
    }),
    name: z.string({
      message: "Nama wajib diisi",
    }),
    createdAt: z.string({
      message: "Tanggal Dibuat wajib diisi",
    }),
  });

  const [totalItems, setTotalItems] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const initialParams = useMemo(() => ({
    page: "1",
    limit: "1"
  }), []);

  const allDataParams = useMemo(() => ({
    page: "1",
    limit: totalItems.toString()
  }), [totalItems]);

  const initialRequest = useGetCageRacks(initialParams);
  const racks = useGetCageRacks(allDataParams);

  useEffect(() => {
    if (initialRequest.data?.data?.meta?.totalData && isFirstLoad) {
      setTotalItems(initialRequest.data.data.meta.totalData);
      setIsFirstLoad(false);
    }
  }, [initialRequest.data, isFirstLoad]);

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
          <Controller
              control={form.control}
              name="rackId"
              render={({ field, fieldState }) => (
                <Autocomplete
                  isLoading={racks.isLoading}
                  labelPlacement="outside"
                  label="Rak"
                  variant="bordered"
                  placeholder="Pilih Rak"
                  defaultItems={racks.data?.data?.data || []}
                  {...field}
                  onSelectionChange={(value) => field.onChange(value)}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {racks.data?.data?.data?.map((position) => (
                    <AutocompleteItem key={position.id} value={position.id}>
                      {position.name}
                    </AutocompleteItem>
                  )) || []}
                </Autocomplete>
              )}
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