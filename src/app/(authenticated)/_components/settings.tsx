import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Autocomplete,
  AutocompleteItem,
  useDisclosure,
} from "@nextui-org/react";
import {
  useGetProfile,
  useGetSiteAvailable,
  useSwitchSite,
} from "../_services/profile";
import { useGetBatchs, useSwitchBatch } from "../_services/batch";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useLocationStore from "@/stores/useLocationStore";
import { useMemo, useCallback } from "react";
import useBatchStore from "@/stores/useBatchStore";
import { MdOutlineSettingsSuggest } from "react-icons/md";

export default function GlobalSettings() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { setSiteId } = useLocationStore();
  const { batchId, setBatchId } = useBatchStore();

  const profile = useGetProfile();
  const sites = useGetSiteAvailable();
  const switchSite = useSwitchSite();
  const batches = useGetBatchs(
    useMemo(
      () => ({
        limit: "1000",
      }),
      []
    )
  );
  const switchBatch = useSwitchBatch();
  const queryClient = useQueryClient();

  const handleSiteChange = useCallback(
    (id: string) => {
      switchSite.mutate(
        {
          body: { siteId: id },
        },
        {
          onSuccess: ({ data: { token } }) => {
            setSiteId(id);
            Cookies.set("accessToken", token);
            queryClient.invalidateQueries();
            toast.success("Berhasil mengganti lokasi");
          },
          onError: () => {
            toast.error("Gagal mengganti lokasi");
          },
        }
      );
    },
    [setSiteId, switchSite, queryClient]
  );

  const handleBatchChange = useCallback(
    (id: string) => {
      try {
        setBatchId(id);
        queryClient.invalidateQueries();
        toast.success("Berhasil mengganti batch");
      } catch (e: any) {
        toast.error("Gagal mengganti batch: " + e.toString());
      }
    },
    [setBatchId, queryClient]
  );

  return (
    <div>
      <Button size="md" onPress={onOpen}>
        <MdOutlineSettingsSuggest size="20" />
        <span>Settings</span>
      </Button>
      <Modal
        isOpen={isOpen}
        size="lg"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
        isDismissable
        className="mobile:full-screen"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Global Settings</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6">
                  {/* Switch Site */}
                  <div>
                    <Autocomplete
                      label="Pilih Lokasi"
                      placeholder="Cari Lokasi"
                      defaultSelectedKey={profile.data?.data?.site?.id || ""}
                      isLoading={sites.isLoading || switchSite.isPending || profile.isLoading}
                      defaultItems={sites.data?.data || []}
                      onSelectionChange={(id) => handleSiteChange(id as string)}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.siteId}>
                          {item.site?.name || "Unknown"}
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </div>

                  {/* Switch Batch */}
                  <div>
                    <Autocomplete
                      label="Pilih Batch"
                      placeholder="Cari Batch"
                      isLoading={batches.isLoading || switchBatch.isPending}
                      defaultItems={batches.data?.data?.data || []}
                      defaultSelectedKey={batchId || ""}
                      onSelectionChange={(id) => handleBatchChange(id as string)}
                    >
                      {(item) => (
                        <AutocompleteItem key={item.id}
                                          value={item.id}
                                          aria-label={`[${item.status}]: ${item.name}`}>
                          <div className="flex gap-2 items-center">
                            <div className="flex flex-col">
                              <span className="text-small">{item.name}</span>
                              <span className="text-tiny text-default-400">
                                {item.status}
                              </span>
                            </div>
                          </div>
                        </AutocompleteItem>
                      )}
                    </Autocomplete>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
