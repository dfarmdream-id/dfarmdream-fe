"use client";
import { Button, Input, Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useGetCages } from "../../../_services/cage";
import { useCreateCageRack } from "../../../_services/rack";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama wajib diisi",
    }),
    cageId: z.string({
      message: "Id kandang",
    }),
    batchId: z.string({
      message: "batch Wajib diisi",
    }),
    createdAt: z.string({
      message: "Tanggal Dibuat wajib diisi",
    })
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
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="name"
              render={({field, fieldState}) => (
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
            <FilterBatch
              onBatchIdChange={(value) => {
                form.setValue("batchId", value);
              }}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="cageId"
              render={({field, fieldState}) => (
                <Autocomplete
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  isLoading={cage.isLoading}
                  variant="bordered"
                  {...field}
                  onSelectionChange={(value) => field.onChange(value)}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {cage.data?.data?.data?.map((item) => (
                    <AutocompleteItem key={item.id} value={item.id}>
                      {item.name}
                    </AutocompleteItem>
                  )) || []}
                </Autocomplete>
              )}
            />
          </div>
          <div>
            {/*  <DatePicker label="Birth date" className="max-w-[284px]" /> */}
            <Controller
              control={form.control}
              name="createdAt"
              defaultValue={
                new Date().toISOString().split("T")[0]
              }
              render={({field, fieldState}) => (
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
