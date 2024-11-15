"use client";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useCreateUser } from "../../_services/user";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const schema = z.object({
    username: z.string({
      message: "ID wajib diisi",
    }),
    password: z.string({
      message: "Password wajib diisi",
    }),
    site: z.optional(z.string()),
    fullName: z.string({
      message: "Nama wajib diisi",
    }),
    position: z.string({
      message: "Jabatan wajib diisi",
    }),
    phone: z.string({
      message: "No HP wajib diisi",
    }),
    address: z.string({
      message: "Alamat wajib diisi",
    }),
    status: z.boolean({
      message: "Status wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
    defaultValues: {
      status: true,
    },
  });

  const submission = useCreateUser();
  const router = useRouter();

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          status: data.status ? "ACTIVE" : "INACTIVE",
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/master/users");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Pengguna</div>
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
              name="position"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Jabatan"
                  label="Jabatan"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  <SelectItem key="Operator">Operator</SelectItem>
                  <SelectItem key="Farm Manager">Farm Manager</SelectItem>
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
          <div className="h-16">
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
