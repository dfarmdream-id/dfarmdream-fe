"use client";
import { Button, Input, Textarea } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useGetUser, useUpdateUser } from "../../../../_services/user";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Link from "next/link";

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
    identityId: z.string({
      message: "KTP wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateUser();
  const router = useRouter();
  const params = useParams();

  const user = useGetUser(useMemo(() => params.id as string, [params.id]));

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
    }
  }, [user.data, form]);

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
          router.push("/master/investors");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Investor</div>
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

          <div className="mt-5 flex gap-3 justify-end md:col-span-2">
            <Button
              variant="bordered"
              color="primary"
              as={Link}
              href="/master/investors"
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
