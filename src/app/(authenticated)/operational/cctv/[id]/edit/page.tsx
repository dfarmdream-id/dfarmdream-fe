"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetCCTV, useUpdateCCTV } from "@/app/(authenticated)/_services/cctv";
import { useGetCages } from "@/app/(authenticated)/_services/cage";

export default function Page() {
  const schema = z.object({
    cageId: z.string({
      message: "Pilih kandang terlebih dahulu",
    }),
    ipAddress: z.string({
      message: "Isi dengan Alamat IP CCTV",
    }),
    description:z.string({
      message:"Mohon isi deskripsi"
    })
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateCCTV();
  const router = useRouter();
  const params = useParams();

  const item = useGetCCTV(useMemo(() => params.id as string, [params.id]));

  useEffect(() => {
    if (item.data) {
      if (item?.data?.data?.ipAddress) {
        form.setValue("ipAddress", item?.data?.data?.ipAddress);
      }
      if (item?.data?.data?.description) {
        form.setValue("description", item?.data?.data?.description);
      }
      if (item?.data?.data?.cageId) {
        form.setValue("cageId", item?.data?.data?.cageId);
      }
    }
  }, [item.data, form]);

  const sites = useGetCages(useMemo(() => ({ page: "1", limit: "100" }), []));

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
          router.push("/operatinal/cctv");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Kandang</div>
      <div>
        <form onSubmit={onSubmit}>
          <div className="h-16">
            <Controller
              control={form.control}
              name="cageId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={sites.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
                >
                  {sites.data?.data?.data?.map((position) => (
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
              name="ipAddress"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="IP Address"
                  placeholder="Masukkan Alamat CCTV"
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
              name="description"
              render={({ field, fieldState }) => (
                <Textarea
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Description"
                  placeholder="Ketikkan deskripsi"
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
