"use client";

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
  // import { HiPencilAlt } from "react-icons/hi";
  import { HiTrash } from "react-icons/hi2";
  import { toast } from "sonner";
  import { useQueryClient } from "@tanstack/react-query";
  // import Link from "next/link";
  import { Can } from "@/components/acl/can";
import { useDeleteKategoriBiaya } from "@/app/(authenticated)/_services/kategori-biaya";
  
  type Props = {
    id: string;
  };
  
  export default function Actions(props: Props) {
    const deleteDisclosure = useDisclosure();
  
    const deleteData = useDeleteKategoriBiaya();
  
    const queryClient = useQueryClient();
  
    const handleDelete = (id: string) => {
      deleteData.mutate(
        { pathVars: { id } },
        {
          onSuccess: () => {
            toast.success("Berhasil menghapus data kategori biaya");
            queryClient.invalidateQueries({
              queryKey: ["/v1/kategori-biaya"],
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
        {/*<Can action="update:cash-flow-category">*/}
        {/*  <Tooltip content="Edit Data">*/}
        {/*    <Button*/}
        {/*      as={Link}*/}
        {/*      href={`/cash/kategori-biaya/${props.id}/edit`}*/}
        {/*      isIconOnly*/}
        {/*      variant="light"*/}
        {/*      color="primary"*/}
        {/*    >*/}
        {/*      <HiPencilAlt />*/}
        {/*    </Button>*/}
        {/*  </Tooltip>*/}
        {/*</Can>*/}
        <Can action="delete:cash-flow-category">
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
  