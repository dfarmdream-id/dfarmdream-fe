"use client";
import { Button, Checkbox, CheckboxGroup, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetPermissions } from "../../../../_services/permission";
import { useGetRole, useUpdateRole } from "../../../../_services/role";
import Loader from "@/components/state/loading";

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

  const submission = useUpdateRole();
  const router = useRouter();
  const params = useParams();

  const position = useGetRole(useMemo(() => params.id as string, [params]));

  useEffect(() => {
    if (position.data) {
      form.setValue("name", position?.data?.data?.name);
      form.setValue(
        "permissions",
        position?.data?.data?.permissions?.map((item) => item.permissionId)
      );
    }
  }, [position, form]);

  const permissions = useGetPermissions(
    useMemo(() => {
      return {
        limit: "1000",
      };
    }, [])
  );

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
          ...data,
          permissions: data.permissions.map((id) => ({ permissionId: id })),
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/master/roles");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Role</div>
      <div>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1">
            <div className="h-16 w-full">
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
                    value={field.value}
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                  >
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {permissions.isLoading && (
                        <div className="w-full min-h-52 flex items-center justify-center">
                          <Loader />
                        </div>
                      )}
                      {permissions.data?.data?.data.map((item) => (
                        <Checkbox key={item.id} value={item.id}>
                          {item.name}
                        </Checkbox>
                      ))}
                    </div>
                  </CheckboxGroup>
                )}
              />
            </div>
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
