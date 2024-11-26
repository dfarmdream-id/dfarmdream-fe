"use client";
import { useLoginInvestor } from "@/app/(authenticated)/_services/investor";
import { useForm } from "@/hooks/form";
import { Button, Card, CardBody, Input } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { useDebounce } from "react-use";
import { toast } from "sonner";
import { z } from "zod";

export default function InvestorSignIn() {
  const schema = z.object({
    username: z
      .string({
        message: "ID wajib diisi",
      })
      .max(100, {
        message: "Maksimal 100 karakter",
      }),
    password: z
      .string({
        message: "Password wajib diisi",
      })
      .max(100, {
        message: "Maksimal 100 karakter",
      }),
  });

  const signInMutation = useLoginInvestor();

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      signInMutation.mutate({ body: data });
    },
    () => {
      toast.error("Harap isi semua data");
    }
  );

  const password = form.watch("password");
  const user = form.watch("username");

  const [] = useDebounce(
    () => {
      if (!user || !password) return;
      const data = form.getValues();
      signInMutation.mutate({
        body: data,
      });
    },
    400,
    [password, user]
  );

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="text-3xl font-semibold mb-10">Welcome Investor 👋</div>

      {signInMutation.isError && (
        <Card shadow="none" className="bg-danger-50 text-danger my-10">
          <CardBody className="text-danger-600">
            {signInMutation.error?.data?.message}
          </CardBody>
        </Card>
      )}

      <div className="mb-10 h-16">
        <Controller
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              labelPlacement="outside"
              label="ID"
              placeholder="NIK/Username"
              variant="bordered"
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
            />
          )}
        />
      </div>

      <div className="mb-10 h-16">
        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Input
              {...field}
              type="password"
              labelPlacement="outside"
              label="Password"
              variant="bordered"
              placeholder="Password"
              fullWidth
              isInvalid={fieldState.invalid}
              errorMessage={fieldState.error?.message}
              onChange={(e) => {
                field.onChange(e.target.value);
              }}
            />
          )}
        />
      </div>

      <Button
        isLoading={signInMutation.isPending}
        type="submit"
        color="primary"
        className="w-full"
      >
        Masuk
      </Button>
    </form>
  );
}
