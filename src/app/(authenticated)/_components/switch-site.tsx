import { Select, SelectItem } from "@nextui-org/react";
import {
  useGetProfile,
  useGetSiteAvailable,
  useSwitchSite,
} from "../_services/profile";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import useLocationStore from "@/stores/useLocationStore";
import { useEffect } from "react";

export default function SwitchSite() {
  const { setSiteId, siteId } = useLocationStore();
  
  const profile = useGetProfile();
  const sites = useGetSiteAvailable();
  const switchSite = useSwitchSite();
  const queryClient = useQueryClient();

  const handleSwitchSite = (siteId: string) => {
    switchSite.mutate(
      {
        body: {
          siteId: siteId,
        },
      },
      {
        onSuccess: ({ data: { token } }) => {
          setSiteId(siteId);
          Cookies.set("accessToken", token);
          queryClient.invalidateQueries();
          toast.success("Berhasil mengganti lokasi");
        },
        onError: () => {
          toast.error("Gagal mengganti lokasi");
        },
      }
    );
  }

  useEffect(() => {
    queryClient.refetchQueries({ 
      queryKey: ["/v1/auth/sites"] 
    });

    if (sites.data?.data?.length) {
      const checkSite = sites.data?.data?.some(site => site.siteId === siteId);
      if (!checkSite) {
        handleSwitchSite(sites.data?.data[0].siteId);
      }
    } 
    // else {
    //   toast.error("Lokasi kosong");
    // }
  }, [sites.data?.data]);

  return (
    <div className="flex items-center w-full">
      <Select
        aria-label="Pilih Lokasi"
        items={sites.data?.data || []}
        labelPlacement="outside-left"
        className="max-w-xs w-full"
        classNames={{
          label: "whitespace-nowrap",
          trigger: "min-h-10",
          listboxWrapper: "max-h-[400px]",
        }}
        isLoading={sites.isLoading || switchSite.isPending || profile.isLoading}
        onChange={(id) => {
          handleSwitchSite(id.target.value.toString());
        }}
        selectedKeys={[profile.data?.data?.site?.id as string]}
        listboxProps={{
          itemClasses: {
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
          },
        }}
        popoverProps={{
          classNames: {
            base: "before:bg-default-200",
            content: "p-0 border-small border-divider bg-background",
          },
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.data?.siteId} className="flex items-center gap-2">
              <div className="flex flex-col">
                <span>Lokasi saat ini</span>
                <span className="text-default-500 text-tiny">
                  ({item.data?.site?.name})
                </span>
              </div>
            </div>
          ));
        }}
      >
        {(item) => (
          <SelectItem key={item.siteId} textValue={item.site.name}>
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-small">{item.site?.name}</span>
              </div>
            </div>
          </SelectItem>
        )}
      </Select>
    </div>
  );
}
