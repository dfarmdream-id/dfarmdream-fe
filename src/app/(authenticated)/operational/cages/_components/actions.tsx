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
import { HiEye, HiTrash } from "react-icons/hi2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useDeleteCage } from "../../../_services/cage";

type Props = {
  id: string;
};

export default function Actions(props: Props) {
  const deleteDisclosure = useDisclosure();

  const deleteData = useDeleteCage();

  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    deleteData.mutate(
      { pathVars: { id } },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus data");
          queryClient.invalidateQueries({
            queryKey: ["/v1/cage"],
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
      <Tooltip content="View Live CCTV">
        <Button
          as={Link}
          href={`/master/cages/${props.id}/cctv`}
          isIconOnly
          variant="light"
          color="primary"
        >
          <HiEye />
        </Button>
      </Tooltip>
      <Tooltip content="Klik untuk edit data">
        <Button
          as={Link}
          href={`/operational/cages/${props.id}/edit`}
          isIconOnly
          variant="light"
          color="primary"
        >
          <HiPencilAlt />
        </Button>
      </Tooltip>
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
