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
import {HiDocument, HiTrash} from "react-icons/hi2";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Can } from "@/components/acl/can";
import { useDeleteDocumentInvestment } from "@/app/(authenticated)/_services/document-investment";
import { usePathname } from "next/navigation";

type Props = {
  id: string;
  urlDocument: string;
};

export default function Actions(props: Props) {
  const deleteDisclosure = useDisclosure();

  const deleteData = useDeleteDocumentInvestment();

  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    deleteData.mutate(
      { pathVars: { id } },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus data");
          queryClient.invalidateQueries({
            queryKey: ["/v1/document-investment"],
          });
          deleteDisclosure.onClose();
        },
        onError: () => {
          toast.error("Gagal menghapus data");
        },
      }
    );
  };
  
  const handleShowDocument = (url: string) => {
    window.open(url, "_blank");
  };

  const path = usePathname();

  return (
    <div className="flex space-x-1">
      <Can action="update:investor">
        <Tooltip content="Edit Data">
          <Button
            as={Link}
            href={`${path}/${props.id}/edit`}
            isIconOnly
            variant="light"
            color="primary"
          >
            <HiPencilAlt />
          </Button>
        </Tooltip>
      </Can>
      <Can action="show:document">
        <Tooltip content="Show Dokumen">
          <Button
            isIconOnly
            variant="light"
            color="default"
            onPress={handleShowDocument.bind(null, props.urlDocument)}
          >
            <HiDocument />
          </Button>
        </Tooltip>
      </Can>
      <Can action="delete:investor">
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
