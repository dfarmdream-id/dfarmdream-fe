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
  import { HiTrash } from "react-icons/hi2";
  import { toast } from "sonner";
  import { useQueryClient } from "@tanstack/react-query";
  import { Can } from "@/components/acl/can";
  
import { useDeleteDokumen } from "@/app/(authenticated)/_services/dokumen";
  type Props = {
    id: string;
  };
  
  export default function UploadAction(props: Props) {
    const deleteDisclosure = useDisclosure();

    const deleteData = useDeleteDokumen();
  
    const queryClient = useQueryClient();
  
    const handleDelete = (id: string) => {
      deleteData.mutate(
        { pathVars: { id } },
        {
          onSuccess: () => {
            toast.success("Berhasil menghapus data");
            queryClient.invalidateQueries({
              queryKey: ["/v1/investor"],
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
  