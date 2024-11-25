"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetRoles } from "../../../../_services/role";
import { useGetInvestor, useUpdateInvestor } from "../../../../_services/investor";

export default function Page() {
  const schema = z.object({
    username: z.string({
      message: "ID wajib diisi",
    }),
    password: z
      .string({
        message: "Password wajib diisi",
      })
      .optional(),
    fullName: z.string({
      message: "Nama wajib diisi",
    }),
    phone: z.string({
      message: "No HP wajib diisi",
    }),
    address: z.string({
      message: "Alamat wajib diisi",
    }),
    identityId: z.string({
      message: "KTP wajib diisi",
    }),
    roles: z.string({
      message: "Role wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateInvestor();
  const router = useRouter();
  const params = useParams();

  const user = useGetInvestor(useMemo(() => params.id as string, [params.id]));
  const role = useGetRoles(useMemo(() => ({ page: "1", limit: "100" }), []));

  useEffect(() => {
    if (user.data) {
      if (user?.data?.data?.username) {
        form.setValue("username", user?.data?.data?.username);
      }
      if (user?.data?.data?.fullName) {
        form.setValue("fullName", user?.data?.data?.fullName);
      }
      if (user?.data?.data?.identityId) {
        form.setValue("identityId", user?.data?.data?.identityId);
      }
      if (user?.data?.data?.phone) {
        form.setValue("phone", user?.data?.data?.phone);
      }
      if (user?.data?.data?.address) {
        form.setValue("address", user?.data?.data?.address);
      }
      if (user?.data?.data?.roles) {
        form.setValue(
          "roles",
          user?.data?.data?.roles
            .map((item) => {
              return item.roleId;
            })
            .join(",")
        );
      }
    }
  }, [user.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          roles: data.roles.split(",").map((item) => {
            return {
              roleId: item,
            };
          }),
        },
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
          router.push("/master/investors");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Investor</div>
      <div>
        <form onSubmit={onSubmit}>
          <div className="h-16">
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="ID Pengguna"
                  placeholder="ID Pengguna"
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
              name="fullName"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Pengguna"
                  placeholder="Nama Pengguna"
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
              name="phone"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="No HP"
                  placeholder="No HP"
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
              name="roles"
              render={({ field, fieldState }) => (
                <Select
                  multiple
                  isLoading={role.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Peran"
                  label="Peran"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={field.value?.split(",")}
                >
                  {role.data?.data?.data?.map((position) => (
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
              name="password"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="password"
                  label="Password"
                  placeholder="Password"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="mb-3">
            <Controller
              control={form.control}
              name="address"
              render={({ field, fieldState }) => (
                <Textarea
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Alamat"
                  placeholder="Alamat"
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
