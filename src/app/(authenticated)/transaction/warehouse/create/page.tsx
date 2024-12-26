"use client";
import {
  Button, Checkbox, Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure
} from "@nextui-org/react";
import { Controller, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { useForm } from "@/hooks/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {useEffect, useMemo} from "react";
import { InputNumber } from "@/components/ui/input";
import { useCreateWarehouseTransaction } from "@/app/(authenticated)/_services/warehouse-transaction";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { useGetProfile } from "@/app/(authenticated)/_services/profile";
import {useGetListJournalType} from "@/app/(authenticated)/_services/journal-type";
import FilterRack from "@/app/(authenticated)/_components/filterRack";
import useBatchStore from "@/stores/useBatchStore";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";

export default function Page() {
  const schema = z.object({
    cageId: z.string({
      message: "Kandang wajib diisi",
    }),
    category: z.enum(["EGG", "CHICKEN"], {
      message: "Pilih kategori",
    }),
    weight: z.number({
      message: "Berat wajib diisi",
    }),
    type: z.string().optional(),
    journalTypeId: z.string({
      message: "Mohon pilih journal type",
    }),
    batchId: z.string({
      message: "Batch wajib diisi",
    }),
    isEndOfBatch: z.boolean().optional(),
    haversts: z.array(
      z.object({
        qty: z
          .number({
            message: "Total Wajib DIisi",
          })
          .min(1, {
            message: "Total Wajib DIisi",
          }),
        rackId: z
          .string({
            message: "Rak Wajib Diisi",
          })
          .min(1, {
            message: "Rak Wajib Diisi",
          }),
      })
    ),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const jurnalTypes = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );

  const submission = useCreateWarehouseTransaction();
  const router = useRouter();

  const onSubmit = form.handleSubmit((data) => {
    submission.mutate(
      {
        body: {
          ...data,
          type: "IN"
        },
      },
      {
        onError: (error) => {
          toast.error(error.data?.message);
        },
        onSuccess: () => {
          toast.success("Berhasil menambahkan data");
          form.reset();
          router.push("/transaction/warehouse");
        },
      }
    );
  });
  
  const confirmDisclosure = useDisclosure();

  const cageId = form.watch("cageId");

  const profile = useGetProfile();

  const cage = useGetCages(
    useMemo(
      () => ({
        page: "1",
        limit: "100",
        siteId: profile?.data?.data?.site?.id as string,
      }),
      [profile]
    )
  );

  const haversts = useFieldArray({
    control: form.control,
    name: "haversts",
  });
  
  const {batchId} = useBatchStore();

  useEffect(() => {
    if(batchId){
      form.setValue("batchId", batchId);
    }
  }, [batchId, form]);

  return (
    <div className="p-5">
      <div className="text-2xl font-bold mb-10">Tambah Transaksi Gudang</div>
      <div>
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
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
              name="category"
              render={({fieldState, field}) => {
                return (
                  <Select
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Pilih kategori"
                    label="Kategori"
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                    {...field}
                  >
                    <SelectItem key="CHICKEN">Ayam</SelectItem>
                    <SelectItem key="EGG">Telur</SelectItem>
                  </Select>
                );
              }}
            />
          </div>
          <div className="h-16">
            <FilterBatch
              onBatchIdChange={(value) => {
                form.setValue("batchId", value);
              }}
            />
          </div>
          <div className="h-16">
            <Controller
              control={form.control}
              name="cageId"
              render={({field, fieldState}) => (
                <Select
                  isLoading={cage.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  label="Kandang"
                  variant="bordered"
                  {...field}
                  errorMessage={fieldState.error?.message}
                  isInvalid={fieldState.invalid}
                >
                  {cage.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>
              )}
            />
          </div>
          <div className="bg-white p-5 rounded-lg md:col-span-2">
            <div className="font-bold">Data Panen</div>
            <ul className="mt-5 grid gap-5">
              {haversts.fields.length == 0 && (
                <div>
                  Data Panen Kosong, Silahkan tambahkan melalui tombol dibawah
                  ini.
                </div>
              )}
              {haversts.fields.map((item, i) => {
                return (
                  <li key={i} className="py-4">
                    <div className="font-bold mb-3">Panen {i + 1}</div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="h-16">
                        <FilterRack
                          onRackIdChange={(value) => {
                            form.setValue(`haversts.${i}.rackId`, value);
                          }}
                          cageId={cageId}
                        />
                      </div>

                      <div className="h-16">
                        <Controller
                          control={form.control}
                          name={`haversts.${i}.qty`}
                          render={({field, fieldState}) => (
                            <InputNumber
                              labelPlacement="outside"
                              variant="bordered"
                              type="text"
                              label={`Jumlah ${form.watch('category') == 'EGG' ? 'Telur' : 'Ayam'}`}
                              placeholder={`Jumlah ${form.watch('category') == 'EGG' ? 'Telur' : 'Ayam'}`}
                              {...field}
                              errorMessage={fieldState.error?.message}
                              isInvalid={fieldState.invalid}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}

              <li className="flex justify-center">
                <Button
                  type="button"
                  className="w-full"
                  color="primary"
                  onPress={() => {
                    haversts.append({qty: 0, rackId: ""});
                  }}
                >
                  Tambah Panen
                </Button>
              </li>
            </ul>
          </div>
          <div className="h-16 py-5 md:col-span-2">
            <Controller
              control={form.control}
              name="weight"
              render={({field, fieldState}) => (
                <div>
                  <InputNumber
                    labelPlacement="outside"
                    variant="bordered"
                    type="text"
                    label="Berat kg"
                    placeholder="Berat kg"
                    {...field}
                    errorMessage={fieldState.error?.message}
                    isInvalid={fieldState.invalid}
                  />
                </div>
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
              onClick={confirmDisclosure.onOpen}
            >
              Simpan
            </Button>
          </div>

          <Modal
            onOpenChange={confirmDisclosure.onOpenChange}
            isOpen={confirmDisclosure.isOpen}
            onClose={confirmDisclosure.onClose}
          >
            <ModalContent>
              <ModalHeader className="gap-2">
                <div>Konfirmasi Simpan</div>
              </ModalHeader>
              <ModalBody>
                <p>
                  Apakah anda yakin ingin menyimpan data ini? Data yang sudah
                  disimpan tidak dapat diubah.
                </p>
                <div>
                {/* add 1 checkbook to ask confirm is end of batch  */}
                <div className="flex gap-2 items-center">
                  {/*<input*/}
                  {/*  type="checkbox"*/}
                  {/*  onChange={(e) => {*/}
                  {/*    form.setValue("isEndOfBatch", e.target.checked);*/}
                  {/*  }}*/}
                  {/*/>*/}
                  {/*<span>*/}
                  {/*  Apakah ini merupakan akhir dari batch?*/}
                  {/*</span>*/}
                  <Checkbox
                    onChange={(e) => {
                      form.setValue("isEndOfBatch", e.target.checked);
                    }}
                  >Apakah ini merupakan akhir dari batch?</Checkbox>
                </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="bordered"
                  color="default"
                  onPress={confirmDisclosure.onClose}
                >
                  Batal
                </Button>
                <Button
                  isLoading={submission.isPending}
                  color="primary"
                  onClick={onSubmit}
                >
                  Submit
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </form>
      </div>
    </div>
  );
}
