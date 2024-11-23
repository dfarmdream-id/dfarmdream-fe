"use client";
import { Button, Checkbox, CheckboxGroup, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateRole } from "../../../_services/role";
import { useGetPermissions } from "../../../_services/permission";
import { useMemo } from "react";

export default function Page() {
  const schema = z.object({
    name: z.string({
      message: "Role wajib diisi",
    }),
    permissions: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateRole();
  const router = useRouter();

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          name: data.name,
          permissions: data.permissions.map((id) => ({ permissionId: id })),
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/master/roles");
        },
      }
    );
  });

  const permissions = useGetPermissions(
    useMemo(() => ({ q: "", page: "1", limit: "1000" }), [])
  );

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Role</div>
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
                  label="Role"
                  placeholder="Role"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>
          <div className="mt-5">
            <Controller
              control={form.control}
              name="permissions"
              render={({ field, fieldState }) => (
                <CheckboxGroup
                  label="Permissions"
                  color="primary"
                  onChange={field.onChange}
                  defaultValue={field.value}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {permissions.data?.data?.data.map((item) => (
                    <Checkbox key={item.id} value={item.id}>
                      {item.name}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
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
