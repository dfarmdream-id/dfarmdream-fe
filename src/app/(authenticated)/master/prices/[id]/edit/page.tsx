"use client";
import { Button,  Select, SelectItem, Switch } from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useGetSites } from "../../../../_services/site";
import { InputNumber } from "@/components/ui/input";
import { useGetPrice, useUpdatePrice } from "../../../../_services/price";
import {Input} from "@nextui-org/input";

export default function Page() {
  const schema = z.object({
   
    value: z.number({
      message: "Harga wajib diisi",
    }),
    siteId: z.string({
      message: "Site wajib diisi",
    }),
    weightPerUnit: z.string({
      message: "Berat per unit wajib diisi",
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

  const submission = useUpdatePrice();
  const router = useRouter();
  const params = useParams();
  const sites = useGetSites(useMemo(() => ({ page: "1", limit: "100" }), []));
  const data = useGetPrice(useMemo(() => params.id as string, [params]));

  useEffect(() => {
    if (data.data) {
      form.setValue("siteId", data?.data?.data?.siteId);
      form.setValue("weightPerUnit", data?.data?.data?.weightPerUnit.toString());
      form.setValue(
        "status",
        data?.data?.data?.status == "ACTIVE" ? true : false
      );
      form.setValue("type", data?.data?.data?.type);
      form.setValue("value", data?.data?.data?.value);
    }
  }, [data.data, form]);

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        pathVars: { id: params.id as string },
        body: {
          ...data,
          name:`Harga ${data.type}`,
          status: data.status ? "ACTIVE" : "INACTIVE",
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil mengubah data");
          form.reset();
          router.push("/master/prices");
        },
      }
    );
  });

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Ubah Harga</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="siteId"
              render={({field, fieldState}) => (
                <Select
                  isLoading={sites.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                  selectedKeys={[field.value]}
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
              name="weightPerUnit"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text" // Tetap gunakan text agar fleksibel
                  label="Berat per Unit"
                  placeholder="Berat per Unit"
                  endContent="KG"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;

                    // Izinkan koma atau titik sebagai pemisah desimal
                    if (/^\d*[.,]?\d*$/.test(value)) {
                      // Ganti koma dengan titik untuk konsistensi nilai numerik
                      field.onChange(value.replace(',', '.'));
                    }
                  }}
                  value={field.value}
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
                  selectedKeys={[field.value]}
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
