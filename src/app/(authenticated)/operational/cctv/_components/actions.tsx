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
import { useDeleteCCTV } from "@/app/(authenticated)/_services/cctv";
import { Can } from "@/components/acl/can";
import { createRef } from "react";
import ReactHlsPlayer from "react-hls-player";

type Props = {
  id: string;
  ip: string;
  name: string;
};

export default function Actions(props: Props) {
  const deleteDisclosure = useDisclosure();
  const viewDisclosure = useDisclosure();

  const deleteData = useDeleteCCTV();

  const queryClient = useQueryClient();

  const handleDelete = (id: string) => {
    deleteData.mutate(
      { pathVars: { id } },
      {
        onSuccess: () => {
          toast.success("Berhasil menghapus data");
          queryClient.invalidateQueries({
            queryKey: ["/v1/sensor"],
          });
          deleteDisclosure.onClose();
        },
        onError: () => {
          toast.error("Gagal menghapus data");
        },
      }
    );
  };
  const ref = createRef<HTMLVideoElement>();

  return (
    <div className="flex space-x-1">
      <Tooltip content="Edit Data">
        <Button
          as={Link}
          href={`/operational/cctv/${props.id}/edit`}
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
      <Can action="view:cage-cctv">
        <Tooltip content="View Live CCTV">
          <Button
            isIconOnly
            variant="light"
            color="primary"
            onPress={viewDisclosure.onOpen}
          >
            <HiEye />
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
      <Modal
        onOpenChange={viewDisclosure.onOpenChange}
        isOpen={viewDisclosure.isOpen}
        onClose={viewDisclosure.onClose}
        size="5xl"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="gap-2">
            <div>Live: {props.name}</div>
          </ModalHeader>
          <ModalBody>
            <ReactHlsPlayer
              playerRef={ref}
              src={props.ip}
              autoPlay={false}
              controls={true}
              width="100%"
              height="auto"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
