"use client";
import { Button, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUpdatePassword } from "../_services/profile";
import { useState } from "react";
import { HiEyeOff } from "react-icons/hi";
import { HiEye } from "react-icons/hi2";

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

  const [passwordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const toggleNewPassword = () => {
    setNewPasswordVisible(!newPasswordVisible);
  };

  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const toggleConfirmPassword = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const onSubmit = form.handleSubmit((data) => {
    if (data.newPassword != data.confirmPassword) {
      toast.error("Konfirmasi password tidak sama");
      return false;
    }
    submission.mutate(
      {
        body: data,
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
              render={({ field }) => (
                <Input
                  label="Password"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your password"
                  {...field}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label="toggle password visibility"
                    >
                      {passwordVisible ? (
                        <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <HiEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={passwordVisible ? "text" : "password"}
                  className="max-w-md"
                />
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <Input
                  label="New Password"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your password"
                  {...field}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleNewPassword}
                      aria-label="toggle password visibility"
                    >
                      {newPasswordVisible ? (
                        <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <HiEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={newPasswordVisible ? "text" : "password"}
                  className="max-w-md"
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
                  label="Confirm Password"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Enter your password"
                  {...field}
                  endContent={
                    <button
                      className="focus:outline-none"
                      type="button"
                      onClick={toggleConfirmPassword}
                      aria-label="toggle password visibility"
                    >
                      {confirmPasswordVisible ? (
                        <HiEyeOff className="text-2xl text-default-400 pointer-events-none" />
                      ) : (
                        <HiEye className="text-2xl text-default-400 pointer-events-none" />
                      )}
                    </button>
                  }
                  type={confirmPasswordVisible ? "text" : "password"}
                  className="max-w-md"
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
