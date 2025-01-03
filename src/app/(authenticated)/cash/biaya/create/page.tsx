"use client";
import {Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem} from "@nextui-org/react";
import { Controller } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  useGetListKategoriBiaya,
} from "@/app/(authenticated)/_services/kategori-biaya";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import {useEffect, useMemo, useState} from "react";
import { useGetUsers } from "@/app/(authenticated)/_services/user";
import { InputNumber } from "@/components/ui/input";
import { useCreateBiaya } from "@/app/(authenticated)/_services/biaya";
import useLocationStore from "@/stores/useLocationStore";
import {useGetListPersediaanBarang} from "@/app/(authenticated)/_services/persediaan-barang";
import {useGetListJournalType} from "@/app/(authenticated)/_services/journal-type";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import useBatchStore from "@/stores/useBatchStore";

export default function Page() {
  const schema = z.object({
    tanggal: z.string({
      message: "Mohon pilih tanggal",
    }),
    cageId: z.string({
      message: "Mohon pilih Kandang",
    }),
    kategoriId: z.string({
      message: "Kategori id tidak boleh dikosongkan",
    }),
    persediaanBarangId: z.string().optional(),
    qty: z.string().optional(),
    userId: z.string({
      message: "Mohon pilih karyawan",
    }),
    biaya: z.number({
      message: "Mohon isi data biaya",
    }),
    batchId: z.string({
      message: "Mohon pilih Batch",
    }),
    keterangan: z.string({
      message: "Mohon isi data biaya",
    }).optional(),
    journalTypeId: z.string({
      message: "Mohon pilih journal type",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const [typeGood, setTypeGood] = useState<string | null>(null);

  // const watch = form.watch();

  const submission = useCreateBiaya();
  const router = useRouter();
  const {siteId} = useLocationStore();

  const kategoriData = useGetListKategoriBiaya(
    useMemo(() => ({ page: "1", limit: "1000" }), [])
  );
  // const siteData = useGetSites(
  //   useMemo(() => ({ page: "1", limit: "10000" }), [])
  // );
  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: siteId ?? "" }),
      [siteId]
    )
  );
  const userData = useGetUsers(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  
  const {batchId} = useBatchStore();
  
  const cageIdSelected = form.watch('cageId')
  const kategoriIdSelected = form.watch('kategoriId')
  const persediaanBarangIdSelected = form.watch('persediaanBarangId')
  const qtyRequest = form.watch('qty') ?? "0"

  const goods = useGetListPersediaanBarang(
    useMemo(
      () => ({ q: "", page: "1", limit: "10000", tipeBarang:typeGood || "", cageId: cageIdSelected }),
      [typeGood, cageIdSelected]
    )
  );
  
  const jurnalTypes = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  
  
  useEffect(() => {
    if (kategoriIdSelected) {
      setTypeGood(
        kategoriData.data?.data?.data?.filter(
          (position) => position.id === kategoriIdSelected
        )[0]?.goodType ?? ""
      );
    }
  }, [kategoriIdSelected]);

  useEffect(() => {
    // get price from persediaanBarangIdSelected 
    const price = goods.data?.data?.data?.filter(
      (position) => position.id === persediaanBarangIdSelected
    )[0]?.harga ?? 0;
    const qtyReal = goods.data?.data?.data?.filter(
      (position) => position.id === persediaanBarangIdSelected
    )[0]?.qty ?? 0;
    
    form.setValue("biaya", price * Number(qtyRequest));
    
    if (Number(qtyRequest) > qtyReal) {
      toast.error(
        `QTY yang diminta melebihi stok barang, stok barang saat ini ${qtyReal}`
      );
    }
  }, [form, persediaanBarangIdSelected, qtyRequest]);
  

  const onSubmit = form.handleSubmit((data) => {
    console.log("Disubmit")
    submission.mutate(
      {
        body: {
          ...data,
          status: 1,
          siteId: siteId
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/cash/biaya");
        },
      }
    );
  });
  
  // batchId
  useEffect(() => {
    if (batchId) {
      form.setValue("batchId", batchId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Data Biaya</div>
      <div>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-5">
          <div className="h-16">
            <Controller
              control={form.control}
              name="tanggal"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="date"
                  label="Tanggal"
                  placeholder="Tanggal"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                />
              )}
            />
          </div>

          <div className="h-16">
            <FilterBatch
              onBatchIdChange={(value) => {
                form.setValue("batchId", value);
              }}
              batchId={form.watch('batchId')}
            />
          </div>

          <div className="h-16">
            <Controller
              control={form.control}
              name="cageId"
              render={({field, fieldState}) => (
                <Select
                  multiple
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
              name="kategoriId"
              render={({field, fieldState}) => (
                <Select
                  multiple
                  isLoading={kategoriData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kategori"
                  label="Kategori"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}

                >
                  {kategoriData.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.namaKategori}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          {
            // get goodType from kategoriData.data?.data?.data 
            typeGood && (
              <>
                <div className="h-16">
                  <Controller
                    control={form.control}
                    name="persediaanBarangId"
                    render={({field, fieldState}) => (
                      <Autocomplete
                        isLoading={goods.isLoading}
                        label="Barang"
                        items={goods.data?.data?.data ?? []} // Use an empty array as fallbac
                        placeholder="Pilih Barang"
                        variant="bordered"
                        labelPlacement="outside"
                        onSelectionChange={(item) => {
                          form.setValue("persediaanBarangId", item?.toString() ?? "");
                        }}
                        {...field}
                        isInvalid={fieldState.invalid}
                        errorMessage={fieldState.error?.message}
                      >
                        {(user) => (
                          <AutocompleteItem key={user.id} textValue={user?.goods?.name}>
                            <div className="flex gap-2 items-center">
                              <div className="flex flex-col">
                                <span className="text-small">{user?.goods?.name}</span>
                                <span className="text-tiny text-default-400">{user?.goods?.sku}</span>
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
                    name="qty"
                    render={({field, fieldState}) => (
                      <Input
                        labelPlacement="outside"
                        variant="bordered"
                        type="number"
                        label="QTY Barang Keluar"
                        placeholder="QTY Barang"
                        {...field}
                        errorMessage={fieldState.error?.message}
                        isInvalid={fieldState.invalid}
                      />
                    )}
                  />
                </div>
              </>
            )
          }

          {/*<div className="h-16">*/}
          {/*  <Controller*/}
          {/*    control={form.control}*/}
          {/*    name="siteId"*/}
          {/*    render={({ field, fieldState }) => (*/}
          {/*      <Select*/}
          {/*        multiple*/}
          {/*        isLoading={siteData.isLoading}*/}
          {/*        labelPlacement="outside"*/}
          {/*        placeholder="Pilih Lokasi"*/}
          {/*        label="Lokasi"*/}
          {/*        variant="bordered"*/}
          {/*        disabled={true}*/}
          {/*        defaultSelectedKeys={[siteId ?? ""]}*/}
          {/*        {...field}*/}
          {/*        errorMessage={fieldState.error?.message}*/}
          {/*        isInvalid={fieldState.invalid}*/}
          {/*      >*/}
          {/*        {siteData.data?.data?.data?.map((position) => (*/}
          {/*          <SelectItem key={position.id} value={position.id}>*/}
          {/*            {position.name}*/}
          {/*          </SelectItem>*/}
          {/*        )) || []}*/}
          {/*      </Select>*/}
          {/*    )}*/}
          {/*  />*/}
          {/*</div>*/}

          <div className="h-16 mt-2">
            <Controller
              control={form.control}
              name="biaya"
              render={({field, fieldState}) => (
                <InputNumber
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Biaya"
                  placeholder="Ketikkan biaya"
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
              name="userId"
              render={({field, fieldState}) => (
                <Select
                  multiple
                  isLoading={userData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Karyawan"
                  label="Karyawan"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}

                >
                  {userData.data?.data?.data?.map((position) => (
                    <SelectItem key={position.id} value={position.id}>
                      {position.fullName}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>

          <div className="h-16 mt-2">
            <Controller
              control={form.control}
              name="keterangan"
              render={({field, fieldState}) => (
                <Input
                  labelPlacement="outside"
                  variant="bordered"
                  type="text"
                  label="Keterangan"
                  placeholder="Keterangan"
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
