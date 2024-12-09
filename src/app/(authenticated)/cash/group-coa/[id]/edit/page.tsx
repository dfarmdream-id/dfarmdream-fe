"use client";
import { Button, Input, Radio, RadioGroup } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { useGetGroupCOA, useUpdateGroupCOA } from "@/app/(authenticated)/_services/group-coa";
import { useEffect, useMemo } from "react";
import { InputNumber } from "@/components/ui/input";

export default function Page() {
  const schema = z.object({
    code: z.number({
        message: "Kode Group COA Wajib diisi",
      }),
    name: z.string({
      message: "Nama group COA wajib diisi",
    }),
    status:z.string({
      message:"Mohon pilih status group"
    })
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateGroupCOA();
  const router = useRouter();
  const params = useParams();

  
  const position = useGetGroupCOA(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      const status = position?.data?.data?.status ?? 0
      form.setValue("code", position?.data?.data?.code);
      form.setValue("name", position?.data?.data?.name);
      form.setValue("status", status.toString());
    }
  }, [position.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
            ...data,
            status:parseInt(data.status)
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/cash/group-coa");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Group COA</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="h-16">
            <Controller
              control={form.control}
              name="code"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Kode"
                  placeholder="Kode Group Coa"
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
              name="name"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama"
                  placeholder="Nama Group COA"
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
                <RadioGroup
                  label="Status"
                  orientation="horizontal"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  <Radio value="0">DEBIT</Radio>
                  <Radio value="1">KREDIT</Radio>
                </RadioGroup>
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button
              variant="bordered"
              color="primary"
              onPress={() => router.back()}
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
