"use client";
import { Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCreateInvestor } from "../../../_services/investor";
import { useGetRoles } from "../../../_services/role";
import { useMemo } from "react";

export default function Page() {
  const schema = z.object({
    username: z.string({
      message: "ID wajib diisi",
    }),
    password: z.string({
      message: "Password wajib diisi",
    }),
    fullName: z.string({
      message: "Nama wajib diisi",
    }),
    phone: z.string({
      message: "No HP wajib diisi",
    }),
    address: z.string({
      message: "Alamat wajib diisi",
    }),
    identityId: z
      .string({
        message: "KTP wajib diisi",
      })
      .max(16, {
        message: "Maksimal 16 karakter",
      }),
    roles: z.string({
      message: "Role wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreateInvestor();
  const role = useGetRoles(useMemo(() => ({ page: "1", limit: "100" }), []));

  const router = useRouter();

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          roles: data.roles.split(",").map((role) => {
            return {
              roleId: role,
            };
          }),
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/master/investors");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Investor</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="username"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="ID Investor"
                  placeholder="ID Investor"
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
              name="identityId"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="NIK"
                  placeholder="NIK"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  maxLength={16}
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
                  label="Nama Investor"
                  placeholder="Nama Investor"
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
          <div className="h-16">
            <Controller
              control={form.control}
              name="roles"
              render={({ field, fieldState }) => (
                <Select
                  multiple
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
          {/* <div className="h-16">
            <div className="text-sm mb-2">Status</div>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Switch
                  defaultChecked
                  isSelected={field.value}
                  onValueChange={field.onChange}
                >
                  Aktif
                </Switch>
              )}
            />
          </div> */}
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
