"use client";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";

import { useEffect, useMemo } from "react";
import { InputNumber } from "@/components/ui/input";
import { useGetJournalType, useUpdateJournalType } from "@/app/(authenticated)/_services/journal-type";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Nama tidak boleh kosong",
    }),
    code: z.number({
      message: "Code tidak boleh kosong",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateJournalType();
  const router = useRouter();
  const params = useParams();

  
  const position = useGetJournalType(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("name", position?.data?.data?.name);
      form.setValue("code", position?.data?.data?.code);
    }
  }, [position.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
            ...data,
            status:"1"
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/cash/journal-type");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Journal Type</div>
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
                  label="Code"
                  placeholder="Ketikkan ID/Kode Journal"
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
                  placeholder="Nama Tipe Jurnal"
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
