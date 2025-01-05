"use client";

import {
  Button, DatePicker,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader, Select, SelectItem,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { HiOutlinePrinter, HiQrCode, HiTrash } from "react-icons/hi2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Can } from "@/components/acl/can";
import QRCode from "react-qr-code";
import {
  useDeleteWarehouseTransaction,
  useGetWarehouseTransaction,
  useSendCashierTransaction,
} from "@/app/(authenticated)/_services/warehouse-transaction";
import {useMemo, useState} from "react";
import { DateTime } from "luxon";
import { IoMdSend } from "react-icons/io";
import {useGetListJournalType} from "@/app/(authenticated)/_services/journal-type";
import {CalendarDate} from "@internationalized/date";

type Props = {
  id: string;
  CashierDeliveryAt?: string;
};

export default function Actions(props: Props) {
  const deleteDisclosure = useDisclosure();
  const qrDisclosure = useDisclosure();
  const sendCashierClosure = useDisclosure();

  const deleteData = useDeleteWarehouseTransaction();
  const sendCashier = useSendCashierTransaction();

  const queryClient = useQueryClient();

  const journalTypes = useGetListJournalType(
    useMemo(() => ({ page: "1", limit: "10000" }), [])
  );
  
  const [journalType, setJournalType] = useState<
    { typeSell: string, typeCash: string }
  >({ typeSell: "", typeCash: "" });
  
  const [dateSend, setDateSend] = useState<Date | null>(null);

  const handleDelete = (id: string) => {
    deleteData.mutate(
      { pathVars: { id } },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus data");
          queryClient.invalidateQueries({
            queryKey: ["/v1/warehouse-transaction"],
          });
          deleteDisclosure.onClose();
        },
        onError: () => {
          toast.error("Gagal menghapus data");
        },
      }
    );
  };

  const handleSendToCashier = (id: string) => {
    sendCashier.mutate(
      { pathVars: { id },
        body: {
          typeSell: journalType.typeSell,
          typeCash: journalType.typeCash,
          dateCreated: dateSend
            ? new Date(
              new Date(dateSend).setHours(
                new Date().getHours(),
                new Date().getMinutes(),
                new Date().getSeconds(),
                new Date().getMilliseconds()
              )
            ).toISOString()
            : new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Berhasil mengirim data ke cashier");
          queryClient.invalidateQueries({
            queryKey: ["/v1/warehouse-transaction"],
          });
          sendCashierClosure.onClose();
        },
        onError: () => {
          toast.error("Gagal menghapus data");
        },
      }
    );
  };

  const data = useGetWarehouseTransaction(useMemo(() => props.id, [props]));

  return (
    <div className="flex space-x-1 print:hidden">
      <Tooltip content="Selesaikan Panen">
        <Can action="update:warehouse-qr">
          <Tooltip content="Print QR">
            <Button
              isIconOnly
              variant="light"
              color="primary"
              onPress={() => {
                qrDisclosure.onOpen();
              }}
            >
              <HiQrCode />
            </Button>
          </Tooltip>
        </Can>
      </Tooltip>
      {/*<Tooltip content="Edit Data">*/}
      {/*  <Can action="update:warehouse-transaction">*/}
      {/*    <Tooltip content="Edit Data">*/}
      {/*      <Button*/}
      {/*        as={Link}*/}
      {/*        href={`/transaction/warehouse/${props.id}/edit`}*/}
      {/*        isIconOnly*/}
      {/*        variant="light"*/}
      {/*        color="primary"*/}
      {/*      >*/}
      {/*        <HiPencilAlt />*/}
      {/*      </Button>*/}
      {/*    </Tooltip>*/}
      {/*  </Can>*/}
      {/*</Tooltip>*/}
      {/*<Can action="delete:warehouse-transaction">*/}
      {/*  <Tooltip content="Hapus Data">*/}
      {/*    <Button*/}
      {/*      isIconOnly*/}
      {/*      variant="light"*/}
      {/*      color="danger"*/}
      {/*      onPress={deleteDisclosure.onOpen}*/}
      {/*    >*/}
      {/*      <HiTrash />*/}
      {/*    </Button>*/}
      {/*  </Tooltip>*/}
      {/*</Can>*/}

      {!props.CashierDeliveryAt && (
        <Can action="update:warehouse-transaction">
          <Tooltip content="Kirim ke gudang kasir">
            <Button
              isIconOnly
              variant="light"
              onPress={sendCashierClosure.onOpen}
            >
              <IoMdSend />
            </Button>
          </Tooltip>
        </Can>
      )}

      <Modal
        onOpenChange={qrDisclosure.onOpenChange}
        isOpen={qrDisclosure.isOpen}
        onClose={qrDisclosure.onClose}
        size="xl"
        classNames={{ closeButton: "print:hidden" }}
      >
        <ModalContent className="print:w-full print:m-0 ">
          <ModalHeader className="gap-2 print:hidden">
            <div>QR Panen {data?.data?.data?.code}</div>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-center w-full gap-5 print:flex">
              <div className="w-1/3">
                <QRCode
                  className="w-full h-fit"
                  value={`https://dfarmdream.id/verify/${data.data?.data?.id}`}
                />
              </div>
              <div className="flex-1">
                <table className="w-full">
                  <tbody>
                    <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                      <td className="px-3 py-1 w-1/4">Lokasi</td>
                      <td className="px-3 py-1">
                        {data?.data?.data?.site?.name}
                      </td>n
                    </tr>
                    <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                      <td className="px-3 py-1 w-1/4">Jenis</td>
                      <td className="px-3 py-1">
                        {data?.data?.data?.category == "CHICKEN"
                          ? "Ayam"
                          : "Telur"}
                      </td>
                    </tr>
                    <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                      <td className="px-3 py-1 w-1/4">Jumlah</td>
                      <td className="px-3 py-1">
                        {data?.data?.data?.qty} {
                          data?.data?.data?.category == "CHICKEN"
                            ? "Ekor"
                            : "Butir Utuh"
                      } {data?.data?.data?.qtyCrack ? ` (${data?.data?.data?.qtyCrack} Retak)` : ""}
                      </td>
                    </tr>
                    <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                      <td className="px-3 py-1 w-1/4">Berat Total</td>
                      <td className="px-3 py-1">
                        {data?.data?.data?.weight} KG
                      </td>
                    </tr>
                    <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                      <td className="px-3 py-1 w-1/4">Karyawan Panen</td>
                      <td className="px-3 py-1">
                        {data.data?.data?.createdBy?.fullName}
                      </td>
                    </tr>
                    <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                      <td className="px-3 py-1 w-1/4">Tanggal Panen</td>
                      <td className="px-3 py-1 overflow-hidden ">
                        <div className="w-full overflow-hidden truncate">
                          {DateTime.fromISO(
                            data.data?.data?.createdAt || ""
                          ).toFormat("dd-MM-yyyy")}
                        </div>
                      </td>
                    </tr>
                    {/*<tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">*/}
                    {/*  <td className="px-3 py-1 w-1/4">*/}
                    {/*    Harga{" "}*/}
                    {/*    {data.data?.data?.category == "CHICKEN"*/}
                    {/*      ? "Ayam"*/}
                    {/*      : "Telur"}{" "}*/}
                    {/*    Pada{" "}*/}
                    {/*    {DateTime.fromISO(*/}
                    {/*      data.data?.data?.price?.createdAt || ""*/}
                    {/*    ).toFormat("dd-MM-yyyy")}*/}
                    {/*  </td>*/}
                    {/*  <td className="px-3 py-1 overflow-hidden ">*/}
                    {/*    <div className="w-full overflow-hidden truncate">*/}
                    {/*      {IDR(data.data?.data?.price?.value || 0)} /Kg*/}
                    {/*    </div>*/}
                    {/*  </td>*/}
                    {/*</tr>*/}
                    {/*<tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">*/}
                    {/*  <td className="px-3 py-1 w-1/4">Total Harga</td>*/}
                    {/*  <td className="px-3 py-1 overflow-hidden ">*/}
                    {/*    <div className="w-full overflow-hidden truncate">*/}
                    {/*      {IDR(*/}
                    {/*        (data.data?.data?.price?.value ?? 0) **/}
                    {/*          (data.data?.data?.weight ?? 0) || 0*/}
                    {/*      )}*/}
                    {/*    </div>*/}
                    {/*  </td>*/}
                    {/*</tr>*/}
                  </tbody>
                </table>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="print:hidden">
            <Button
              variant="bordered"
              color="default"
              className="w-full"
              onPress={qrDisclosure.onClose}
            >
              Batal
            </Button>
            <Button
              isLoading={deleteData.isPending}
              color="primary"
              className="w-full"
              startContent={<HiOutlinePrinter />}
              onPress={() => {
                window.open(`/verify/${props.id}?print=true`, "_blank");
              }}
            >
              Print
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        onOpenChange={deleteDisclosure.onOpenChange}
        isOpen={deleteDisclosure.isOpen}
        onClose={deleteDisclosure.onClose}
      >
        <ModalContent>
          <ModalHeader className="gap-2">
            <div>Konfirmasi Hapus</div>
          </ModalHeader>
          <ModalBody>
            <p>Apakah anda yakin ingin menghapus data ini?</p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              color="default"
              onPress={deleteDisclosure.onClose}
            >
              Batal
            </Button>
            <Button
              isLoading={deleteData.isPending}
              color="danger"
              startContent={<HiTrash />}
              onPress={handleDelete.bind(null, props.id)}
            >
              Hapus
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        onOpenChange={sendCashierClosure.onOpenChange}
        isOpen={sendCashierClosure.isOpen}
        onClose={sendCashierClosure.onClose}
      >
        <ModalContent>
          <ModalHeader className="gap-2">
            <div>Konfirmasi Kirim Transaksi</div>
          </ModalHeader>
          <ModalBody>
            <p>Apakah anda yakin ingin mengirim transaksi ini ke kasir?</p>
            <DatePicker
              variant="bordered"
              labelPlacement="outside"
              label="Tanggal"
              value={
                dateSend
                  ? new CalendarDate(
                    dateSend.getFullYear(),
                    dateSend.getMonth() + 1,
                    dateSend.getDate()
                  )
                  : new CalendarDate(
                    new Date().getFullYear(),
                    new Date().getMonth() + 1,
                    new Date().getDate()
                  )
              }
              onChange={(newDate) => {
                const formattedDate = `${newDate.year}-${String(newDate.month).padStart(2, "0")}-${String(newDate.day).padStart(2, "0")}`;
                
                setDateSend(new Date(formattedDate));
              }}
            />
            <Select
              label="Jurnal Penjualan"
              placeholder="Pilih Jurnal Penjualan"
              variant="bordered"
              labelPlacement="outside"
              isLoading={journalTypes.isLoading}
              onChange={(e) => {
                setJournalType({
                  ...journalType,
                  typeSell: e.target.value,
                });
              }}
            >
              {journalTypes.data?.data?.data?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {
                    `${type.code} - ${type.name}`
                  }
                </SelectItem>
              )) ?? []}
            </Select>
            <Select
              label="Jurnal Penerimaan Uang"
              placeholder="Pilih Jurnal Penerimaan Uang"
              variant="bordered"
              labelPlacement="outside"
              isLoading={journalTypes.isLoading}
              onChange={(e) => {
                setJournalType({
                  ...journalType,
                  typeCash: e.target.value,
                });
              }}
            >
              {journalTypes.data?.data?.data?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {
                    `${type.code} - ${type.name}`
                  }
                </SelectItem>
              )) ?? []}
            </Select>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="bordered"
              color="default"
              onPress={sendCashierClosure.onClose}
            >
              Batal
            </Button>
            <Button
              isLoading={sendCashier.isPending}
              color="danger"
              startContent={<IoMdSend />}
              onPress={handleSendToCashier.bind(null, props.id)}
            >
              Ya Kirim
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
