"use client";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetPermission,
  useUpdatePermission,
} from "../../../_services/permission";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Permission wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdatePermission();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();

  const position = useGetPermission(
    useMemo(() => params.id as string, [params])
  );

  useEffect(() => {
    if (position.data) {
      form.setValue("name", position?.data?.data?.name);
    }
  }, [position.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/master/permissions");
          queryClient.invalidateQueries({
            queryKey: ["/v1/auth/profile"],
          });
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Permission</div>
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
                  label="Permission"
                  placeholder="Permission"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mt-5 flex gap-3 justify-end">
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
