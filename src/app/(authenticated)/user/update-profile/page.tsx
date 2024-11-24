"use client";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import {  useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUpdateProfile } from "../_services/profile";
import { useGetProfile } from "../../_services/profile";

export default function Page() {
  const schema = z.object({
    username: z.string({
      message: "Username tidak boleh kosong",
    }),
    fullName: z.string({
      message: "Mohon isi nama lengkap",
    }),
    phone: z.string({
      message: "Mohon isi nomor telp",
    }),
    address: z.string({
      message: "Mohon isi alamat",
    }),
    email: z.string({
      message: "Email tidak boleh kosong",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdateProfile();
  const router = useRouter();
  const profile = useGetProfile();

  useEffect(() => {
    if (profile.data) {
      if (profile?.data?.data) {
        form.setValue("username", profile?.data?.data?.username);
        form.setValue("fullName", profile?.data?.data?.fullName);
        form.setValue("phone", profile?.data?.data?.phone);
        form.setValue("address", profile?.data?.data?.address);
        form.setValue("email", profile?.data?.data?.email);
      }
    }
  }, [profile.data, form]);
 
  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: data,
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil melakukan update profile");
          form.reset();
          router.push("/dashboard");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Profile</div>
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
                  label="Username"
                  placeholder="Ketikkan Username Anda"
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
                  label="Nama Lengkap"
                  placeholder="Ketikkan Nama Lengkap Anda"
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
              name="email"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="email"
                  label="Email"
                  placeholder="Ketikkan Email Anda"
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
                  label="Phone"
                  placeholder="Ketikkan Nomor HP"
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
              name="address"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Alamat"
                  placeholder="Ketikkan Alamat Anda"
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
