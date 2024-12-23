"use client";
import {Autocomplete, AutocompleteItem, Button, Select, SelectItem} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { InputNumber } from "@/components/ui/input";
import { useGetSites } from "@/app/(authenticated)/_services/site";
import { useMemo } from "react";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useCreatePersediaanBarang } from "@/app/(authenticated)/_services/persediaan-barang";
import {useGetListJournalType} from "@/app/(authenticated)/_services/journal-type";
import {useGetListGood} from "@/app/(authenticated)/_services/good";

export default function Page() {
  const schema = z.object({
    goodId: z.string({
      message: "Barang Wajib Diisi",
    }),
    qty: z.number({
      message: "Jumlah barang wajib diisi",
    }),
    harga: z.number({
      message: "Harga barang wajib diisi",
    }),
    siteId: z.string({
      message: "Mohon pilih lokasi",
    }),
    cageId: z.string({
      message: "Mohon pilih kandang",
    }),
    journalTypeId: z.string({
      message: "Mohon pilih journal type",
    })
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const submission = useCreatePersediaanBarang();
  const router = useRouter();

  const watch = form.watch();
  const siteData = useGetSites(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: watch.siteId }),
      [watch.siteId]
    )
  );

  const goods = useGetListGood(
    useMemo(
      () => ({ q: "", page: "1", limit: "10000", }),
      []
    )
  );

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          status: 1,
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/stock/persediaan-barang");
        },
      }
    );
  });

  const jurnalTypes = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Persediaan Barang</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">

          <div className="h-16">
            <Controller
              control={form.control}
              name="siteId"
              render={({field, fieldState}) => (
                <Select
                  isLoading={siteData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Lokasi"
                  label="Lokasi"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {siteData.data?.data?.data?.map((position) => (
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
              name="cageId"
              render={({field, fieldState}) => (
                <Select
                  isLoading={cagesData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {cagesData.data?.data?.data?.map((position) => (
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
              name="goodId"
              render={({field, fieldState}) => (
                <Autocomplete
                  isLoading={goods.isLoading}
                  label="Barang"
                  items={goods.data?.data?.data ?? []} // Use an empty array as fallbac
                  placeholder="Pilih Barang"
                  variant="bordered"
                  labelPlacement="outside"
                  onSelectionChange={(item) => {
                    form.setValue("goodId", item?.toString() ?? "");
                  }}
                  {...field}
                  isInvalid={fieldState.invalid}
                  errorMessage={fieldState.error?.message}
                >
                  {(user) => (
                    <AutocompleteItem key={user.id} textValue={user.name}>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">{user.name}</span>
                          <span className="text-tiny text-default-400">{user.sku}</span>
                        </div>
                      </div>
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="journalTypeId"
              render={({field, fieldState}) => (
                <Select
                  label="Journal Type"
                  placeholder="Pilih Journal Type"
                  variant="bordered"
                  labelPlacement="outside"
                  isLoading={jurnalTypes.isLoading}
                  {...field}
                  selectedKeys={[field.value]}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {jurnalTypes.data?.data?.data?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {
                        `${type.code} - ${type.name}`
                      }
                    </SelectItem>
                  )) ?? []}
                </Select>
              )}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="qty"
              render={({field, fieldState}) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="QTY"
                  placeholder="Jumlah Barang"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="h-16 mt-2">
            <Controller
              control={form.control}
              name="harga"
              render={({field, fieldState}) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Harga"
                  placeholder="Ketikkan Harga Barang"
                  startContent="Rp. "
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
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
