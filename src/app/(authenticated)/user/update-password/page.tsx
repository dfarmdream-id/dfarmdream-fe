"use client";
import { Button, Input, } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdatePassword } from "../_services/profile";

export default function Page() {
  const schema = z.object({
    currentPassword: z.string({
      message: "Mohon ketikkan password saat ini",
    }),
    newPassword: z.string({
      message: "Mohon ketikkan password baru",
    }),
    confirmPassword: z.string({
      message: "Mohon ketikkan password baru",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useUpdatePassword();
  const router = useRouter();


  const onSubmit = form.handleSubmit((data) => {
    if(data.newPassword!=data.confirmPassword){
        toast.error("Konfirmasi password tidak sama") 
        return false
    }
    submission.mutate(
      {
        body: data
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil melakukan update password");
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
              name="currentPassword"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="password"
                  label="Password Saat Ini"
                  placeholder="Ketikkan password anda"
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
              name="newPassword"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="password"
                  label="Password Baru"
                  placeholder="Ketikkan password baru anda"
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
              name="confirmPassword"
              render={({ field, fieldState }) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="password"
                  label="Password Baru"
                  placeholder="Ketikkan password baru anda"
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
