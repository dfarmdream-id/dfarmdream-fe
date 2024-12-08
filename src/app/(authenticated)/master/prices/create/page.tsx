"use client";
import {Button, Input, Select, SelectItem, Switch} from "@nextui-org/react";
import {Controller} from "react-hook-form";
import {z} from "zod";
import {useForm} from "@/hooks/form";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {InputNumber} from "@/components/ui/input";
import {useGetSites} from "../../../_services/site";
import {useEffect, useMemo} from "react";
import {useCreatePrice} from "../../../_services/price";
import useLocationStore from "@/stores/useLocationStore";

export default function Page() {
  const schema = z.object({
    name: z
      .string({
        message: "Nama jabatan wajib diisi",
      })
      .max(100, {
        message: "Maksimal 100 karakter",
      }),
    value: z.number({
      message: "Harga wajib diisi",
    }),
    siteId: z.string({
      message: "Site wajib diisi",
    }),
    status: z.boolean({
      message: "Status wajib diisi",
    }),
    type: z.string({
      message: "Tipe wajib diisi",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });
  const sites = useGetSites(useMemo(() => ({page: "1", limit: "100"}), []));
  const submission = useCreatePrice();
  const router = useRouter();
  const {siteId} = useLocationStore();

  useEffect(() => {
    if (siteId) {
      form.setValue("siteId", siteId ?? ""); // Mengatur default value ke form
    }
  }, [siteId, form]);

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
          router.push("/master/prices");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Harga</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="siteId"
              render={({field, fieldState}) => (
                <Select
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  isLoading={sites.isLoading}
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  disabled={true}
                  defaultSelectedKeys={[siteId ?? ""]}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {sites.data?.data?.data?.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>
          <div className="h-16">
            <Controller
              control={form.control}
              name="name"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Nama Harga"
                  placeholder="Nama Harga"
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
              name="value"
              render={({field, fieldState}) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Harga"
                  placeholder="Harga"
                  startContent="Rp. "
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
              name="type"
              render={({field, fieldState}) => (
                <Select
                  labelPlacement="outside"
                  variant="bordered"
                  label="Tipe"
                  placeholder="Tipe"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  <SelectItem key="CHICKEN">Ayam</SelectItem>
                  <SelectItem key="EGG">Telur</SelectItem>
                </Select>
              )}
            />
          </div>
          <div className="h-16">
            <div className="text-sm mb-2">Status</div>
            <Controller
              control={form.control}
              name="status"
              render={({field}) => (
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
