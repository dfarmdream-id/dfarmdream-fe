"use client";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import {
  SignInChooseResponse,
  SignInResponse,
} from "../_models/response/sign-in";
import { z } from "zod";
import { useHttpMutation } from "@/hooks/http";
import Cookies from "js-cookie";
import { useDebounce } from "react-use";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";

export default function UserSignIn() {
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
    siteId: z.optional(z.string()),
  });

  const signInChooseMutation = useHttpMutation<
    z.infer<typeof schema>,
    SignInChooseResponse
  >("/v1/auth/sign-in/choose", {
    method: "POST",
    queryOptions: {
      onError: (error) => {
        toast.error(error.data?.message);
      },
      onSuccess: ({ data: { token } }) => {
        Cookies.set("accessToken", token);
        toast.success("Berhasil login");
        location.href = "/dashboard";
      },
    },
  });

  const signInMutation = useHttpMutation<
    z.infer<typeof schema>,
    SignInResponse
  >("/v1/auth/sign-in", {
    method: "POST",
    queryOptions: {
      onError: (error) => {
        toast.error(error.data?.message);
      },
    },
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      signInChooseMutation.mutate({ body: data });
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
      <div className="text-3xl font-semibold mb-10">Welcome User 👋</div>

      {signInChooseMutation.isError && (
        <Card shadow="none" className="bg-danger-50 text-danger my-10">
          <CardBody className="text-danger-600">
            {signInChooseMutation.error?.data?.message}
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

      <div className="mb-10 h-16 space-y-10">
        <Controller
          control={form.control}
          name="siteId"
          render={({ field }) => (
            <Select
              {...field}
              labelPlacement="outside"
              label="Lokasi"
              placeholder="Lokasi"
              variant="bordered"
              fullWidth
              isLoading={signInMutation.isPending}
            >
              {signInMutation.data?.data?.sites
                ?.filter((item) => item.site?.deletedAt === null) // Filter site yang belum dihapus
                .map((item) => (
                  <SelectItem key={item.siteId}>{item.site?.name}</SelectItem>
                )) || []}
            </Select>
          )}
        />
      </div>
      <Button
        isLoading={signInChooseMutation.isPending}
        type="submit"
        color="primary"
        className="w-full"
      >
        Masuk
      </Button>
    </form>
  );
}
