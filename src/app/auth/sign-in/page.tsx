"use client";
import Logo from "@/components/assets/logo";
import { useForm } from "@/hooks/form";
import { useHttpMutation } from "@/hooks/http";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Cookies from "js-cookie";
import { Controller } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  SignInChooseResponse,
  SignInResponse,
} from "../_models/response/sign-in";
import { useDebounce } from "react-use";

export default function Page() {
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
    <div className="min-h-screen bg-gradient-to-tr from-secondary/20 to-primary/20 flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 py-10 bg-white max-w-screen-lg mx-auto w-full rounded-xl">
        <div className="flex justify-center items-center order-2 md:order-1">
          <div className="w-full p-5">
            <form onSubmit={onSubmit} className="w-full">
              <div className="text-3xl font-semibold mb-10">Welcome 👋</div>

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
                      {signInMutation.data?.data?.sites?.map((item) => {
                        return (
                          <SelectItem key={item.siteId}>
                            {item?.site?.name}
                          </SelectItem>
                        );
                      }) || []}
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
          </div>
        </div>
        <Card className="bg-primary flex justify-center items-center p-8 order-1 md:order-1">
          <CardBody className="flex justify-center items-center">
            <Logo className="lg:h-40 w-auto" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
