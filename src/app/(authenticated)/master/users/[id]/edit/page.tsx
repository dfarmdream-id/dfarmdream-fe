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
import { useGetUser, useUpdateUser } from "../../../_services/user";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetSites } from "../../../_services/site";
import { useGetRoles } from "../../../_services/role";
import { useGetPositions } from "../../../_services/position";
import Link from "next/link";

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
    site: z.optional(z.string()),
    fullName: z.string({
      message: "Nama wajib diisi",
    }),
    positionId: z.string({
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
    sites: z.string(),
    roles: z.string().optional(),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
    defaultValues: {
      status: true,
    },
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
      if (user?.data?.data?.position?.id) {
        form.setValue("positionId", user?.data?.data?.position?.id || "");
      }
      if (user?.data?.data?.phone) {
        form.setValue("phone", user?.data?.data?.phone);
      }
      if (user?.data?.data?.address) {
        form.setValue("address", user?.data?.data?.address);
      }
      if (user?.data?.data?.sites) {
        form.setValue(
          "sites",
          user?.data?.data?.sites?.map((v) => v.siteId).join(",")
        );
      }
      if (user?.data?.data?.status) {
        form.setValue("status", user?.data?.data?.status === "ACTIVE");
      }
      if (user.data?.data?.roles) {
        form.setValue(
          "roles",
          user?.data?.data?.roles.map((v) => v.roleId).join(",")
        );
      }
    }
  }, [user.data, form]);

  const positions = useGetPositions(
    useMemo(() => ({ page: "1", limit: "100" }), [])
  );
  const sites = useGetSites(useMemo(() => ({ page: "1", limit: "100" }), []));
  const role = useGetRoles(useMemo(() => ({ page: "1", limit: "100" }), []));

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          status: data.status ? "ACTIVE" : "INACTIVE",
          sites: data.sites.split(",").map((site) => {
            return {
              siteId: site,
            };
          }),
          roles: data.roles?.split(",").map((role) => {
            return {
              roleId: role,
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
          router.push("/master/users");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Data Pengguna</div>
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
              name="positionId"
              render={({ field, fieldState }) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Jabatan"
                  label="Jabatan"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={field.value ? [field.value] : []}
                >
                  {positions.data?.data?.data?.map((position) => (
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
                  selectionMode="multiple"
                  selectedKeys={field.value ? field.value.split(",") : []}
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
              name="sites"
              render={({ field, fieldState }) => (
                <Select
                  multiple
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectionMode="multiple"
                  selectedKeys={field.value ? field.value.split(",") : []}
                >
                  {sites.data?.data?.data?.map((position) => (
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
            <Button
              variant="bordered"
              color="primary"
              as={Link}
              href="/master/users"
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
