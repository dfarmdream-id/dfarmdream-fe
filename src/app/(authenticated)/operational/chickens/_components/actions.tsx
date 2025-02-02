import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { HiPencilAlt } from "react-icons/hi";
import { HiQrCode, HiTrash} from "react-icons/hi2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {useDeleteChicken, useGetChicken} from "@/app/(authenticated)/_services/chicken";
import { Can } from "@/components/acl/can";
import {useMemo} from "react";
import QRCode from "react-qr-code";

type Props = {
  id: string;
};

export default function Actions(props: Props) {
  const deleteDisclosure = useDisclosure();

  const deleteData = useDeleteChicken();

  const queryClient = useQueryClient();

  const qrDisclosure = useDisclosure();
  const data = useGetChicken(useMemo(() => props.id as string, [props.id]));

  const handleDelete = (id: string) => {
    deleteData.mutate(
      { pathVars: { id } },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus data");
          queryClient.invalidateQueries({
            queryKey: ["/v1/chicken"],
          });
          deleteDisclosure.onClose();
        },
        onError: () => {
          toast.error("Gagal menghapus data");
        },
      }
    );
  };

  return (
    <div className="flex space-x-1">
      <Can action="update:chicken">
        <Tooltip content="Edit Data">
          <Button
            as={Link}
            href={`/operational/chickens/${props.id}/edit`}
            isIconOnly
            variant="light"
            color="primary"
          >
            <HiPencilAlt />
          </Button>
        </Tooltip>
      </Can>
      <Can action="print:qr-chicken">
        <Tooltip content="Show QR">
          <Button
            isIconOnly
            variant="light"
            color="default"
            onPress={qrDisclosure.onOpen}
          >
            <HiQrCode />
          </Button>
        </Tooltip>
      </Can>
      <Can action="delete:chicken">
        <Tooltip content="Hapus Data">
          <Button
            isIconOnly
            variant="light"
            color="danger"
            onPress={deleteDisclosure.onOpen}
          >
            <HiTrash />
          </Button>
        </Tooltip>
      </Can>
      <Modal
        onOpenChange={qrDisclosure.onOpenChange}
        isOpen={qrDisclosure.isOpen}
        onClose={qrDisclosure.onClose}
        size="xl"
        classNames={{ closeButton: "print:hidden" }}
      >
        <ModalContent className="print:w-full print:m-0 ">
          <ModalHeader className="gap-2 print:hidden">
            <div>QR {
              data?.data?.data?.name
            }</div>
          </ModalHeader>
          <ModalBody>
            <div className="flex items-center w-full gap-5 print:flex">
              <div className="w-1/3">
                <QRCode
                  className="w-full h-fit"
                  value={`chicken|${data.data?.data?.id}`}
                />
              </div>
              <div className="flex-1">
                <table className="w-full">
                  <tbody>
                  <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                    <td className="px-3 py-1 w-1/4">Lokasi</td>
                    <td className="px-3 py-1">
                      {
                        data?.data?.data?.rack?.cage?.site?.name
                      }
                    </td>
                  </tr>
                  <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                    <td className="px-3 py-1 w-1/4">Kandang</td>
                    <td className="px-3 py-1">
                      {
                        data?.data?.data?.rack?.cage?.name
                      }
                    </td>
                  </tr>
                  <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                    <td className="px-3 py-1 w-1/4">Rack</td>
                    <td className="px-3 py-1">
                      {
                        data?.data?.data?.rack?.name
                      }
                    </td>
                  </tr>
                  <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
                    <td className="px-3 py-1 w-1/4">Batch</td>
                    <td className="px-3 py-1">
                      {
                        data?.data?.data?.batch?.name
                      }
                    </td>
                  </tr>
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
    </div>
  );
}
