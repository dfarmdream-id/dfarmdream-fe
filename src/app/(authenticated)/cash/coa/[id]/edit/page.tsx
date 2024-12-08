"use client";
import { Button, Input, Select, SelectItem, Switch } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import {  useGetListGroupCOA } from "@/app/(authenticated)/_services/group-coa";
import { useEffect, useMemo } from "react";
import { useGetCOA, useUpdateCOA } from "@/app/(authenticated)/_services/coa";
import { InputNumber } from "@/components/ui/input";

export default function Page() {
  const schema = z.object({
    code: z.number({
      message: "Kode Wajib Diisi",
    }),
    name: z.string({
      message: "Nama Wajib Diisi",
    }),
    isRetainedEarnings:z.boolean(),
    isBalanceSheet:z.boolean(),
    level:z.number({
      message:"Level wajib diisi"
    }),
    groupId:z.string({
      message:"Group wajib diisi"
    })
  });


  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const groupCoas = useGetListGroupCOA(
    useMemo(() => ({ page: "1", limit: "1000" }), [])
  );

  const submission = useUpdateCOA();
  const router = useRouter();
  const params = useParams();

  
  const position = useGetCOA(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("code", position?.data?.data?.code);
      form.setValue("name", position?.data?.data?.name);
      form.setValue("level", position?.data?.data?.level);
      form.setValue("groupId", position?.data?.data?.groupId);
      form.setValue("isBalanceSheet", position?.data?.data?.isBalanceSheet);
      form.setValue("isRetainedEarnings", position?.data?.data?.isRetainedEarnings);
    }
  }, [position.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
            ...data
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/cash/coa");
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
                  placeholder="Kode COA"
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
                  label="Nama Akun Coa"
                  placeholder="Ketikkan nama COA"
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
              name="groupId"
              render={({ field, fieldState }) => (
                <Select
                  isLoading={groupCoas.isLoading}
                  multiple
                  labelPlacement="outside"
                  placeholder="Pilih Rak"
                  label="Group COOA"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value as string]}
                >
                  {groupCoas.data?.data?.data?.map((position) => (
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
              name="level"
              render={({ field, fieldState }) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Level"
                  placeholder="Ketikkan level"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          
          <div className="h-16">
            <div className="text-sm mb-2">Is Neraca</div>
            <Controller
              control={form.control}
              name="isBalanceSheet"
              render={({ field }) => (
                <Switch
                  defaultChecked
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  Neraca
                </Switch>
              )}
            />
          </div>

          <div className="h-16">
            <div className="text-sm mb-2">Is Laba Tahan</div>
            <Controller
              control={form.control}
              name="isRetainedEarnings"
              render={({ field }) => (
                <Switch
                  defaultChecked
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  Laba Tahan
                </Switch>
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
