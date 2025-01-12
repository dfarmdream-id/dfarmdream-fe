"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  Avatar,
  Button,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Navbar,
  NavbarContent,
  NavbarItem,
  ScrollShadow, Skeleton,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { sectionNestedItems } from "@/components/ui/sidebar-items";
import { SidebarItem } from "@/components/ui/sidebar";
import { Role } from "@/app/(authenticated)/_models/response/profile";
import { useGetProfile } from "./_services/profile";
import { useAuthStore } from "../auth/_store/auth";
import useLocationStore from "@/stores/useLocationStore";
import Logo from "@/components/assets/logo";
import useSidebarStore from "@/stores/useSidebarStore";
import {usePathname} from "next/navigation";
import {IoReorderThree} from "react-icons/io5";
import {BiXCircle} from "react-icons/bi";
import useModalStore from "@/stores/useModalStore";
import {MdOutlineSettingsSuggest} from "react-icons/md";

const Sidebar = dynamic(() => import("@/components/ui/sidebar"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useGetProfile();
  const { setPermissions } = useAuthStore();
  const { setSiteId } = useLocationStore();

  const pathname = usePathname();
  
  const {
    isSidebarOpen,
    toggleSidebar,
  } = useSidebarStore(
    (state) => state
  )
  
  const [filteredItems, setFilteredItems] = useState(sectionNestedItems);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggleSidebar = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  const hasPermission = useCallback((item: SidebarItem, roles: Role[], hasGlobalPermission: boolean): boolean => {
    if (hasGlobalPermission) return true;
    if (item.can === "*") return true;
    if (item.can) {
      return roles.some((role) =>
        role.role.permissions.some((p) => p.permission.code === item.can)
      );
    }
    return true;
  }, []);

  const checkPermissionsRecursively = useCallback((items: SidebarItem[], roles: Role[], hasGlobalPermission: boolean): SidebarItem[] => {
    return items.filter((item) => {
      const isItemAllowed = hasPermission(item, roles, hasGlobalPermission);
      if (item.items && item.items.length > 0) {
        const filteredChildItems = checkPermissionsRecursively(item.items, roles, hasGlobalPermission);
        if (filteredChildItems.length > 0) {
          item.items = filteredChildItems;
          return true;
        }
      }
      return isItemAllowed;
    });
  }, [hasPermission]);

  useEffect(() => {
    if (!data?.data) return;
    const { roles, site } = data.data;
    const hasGlobalPermission = roles.some((role) =>
      role.role.permissions.some((p) => p.permission.code === "*")
    );

    if (roles?.length > 0) {
      setPermissions(
        roles.flatMap((role) =>
          role.role.permissions.map((p) => p.permission.code)
        )
      );

      const filteredItems = checkPermissionsRecursively(sectionNestedItems, roles, hasGlobalPermission);
      setFilteredItems(filteredItems);
    }

    if (site?.id) {
      setSiteId(site.id);
    }
  }, [checkPermissionsRecursively, data, setPermissions, setSiteId, isPending]);
  
  // if pathname change and sidebar is open, close the sidebar
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      handleToggleSidebar();
    }
  }, [pathname]);

  const { toggleModal } = useModalStore(); // Gunakan store modal

  const sidebarContent = (
    <>
      <div className={cn("flex items-center", isMobile ? "justify-between px-2" : "justify-center")}>
        {!isSidebarOpen ? (
          <Image className="h-10" src="/icon.png" alt="Logo Compact" />
        ) : (
          <Logo className="h-16" />
        )}
        {isMobile && isSidebarOpen && (
          <Button isIconOnly variant="light" onPress={() => handleToggleSidebar()}>
            <BiXCircle size={24} className="text-default-500" />
          </Button>
        )}
      </div>
      <ScrollShadow hideScrollBar offset={100}>
        {
          (isPending) ? (
            <div className={cn("p-4", isSidebarOpen ? "space-y-3" : "space-y-1")}>
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "flex gap-4 h-11 relative justify-center items-center w-full max-w-full",
                    isSidebarOpen ? "p-4" : "p-0"
                  )}
                >
                  {isSidebarOpen ? (
                    <>
                      <Skeleton className="w-full h-full absolute z-0 rounded-xl"/>
                      <div>
                        <Skeleton className="w-8 h-8 rounded-xl"/>
                      </div>
                      <div className="flex-1 space-y-3">
                        <Skeleton className="w-full h-2 rounded-xl"/>
                        <Skeleton className="w-full h-2 rounded-xl"/>
                      </div>
                    </>
                  ) : (
                    <div>
                      <Skeleton className="w-8 h-8 rounded-xl"/>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Sidebar key={pathname} defaultSelectedKey="home" isCompact={!isSidebarOpen && !isMobile} items={filteredItems}/>
          )
        }
      </ScrollShadow>
    </>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {isMobile ? (
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              <motion.div
                className="absolute inset-0 bg-black/30"
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                transition={{duration: 0.3}}
              />
              <motion.aside
                className="relative z-50 w-72 border-r border-divider bg-white p-2"
                initial={{ x: -288 }}
                animate={{ x: 0 }}
                exit={{ x: -288 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {sidebarContent}
              </motion.aside>
            </div>
          )}
        </AnimatePresence>
      ) : (
        <aside className={cn("relative flex flex-col h-full border-r border-divider p-2 transition-[width]", isSidebarOpen ? "w-72" : "w-16 items-center px-2 py-6")}>
          {sidebarContent}
        </aside>
      )}
      <div className="flex flex-1 flex-col min-w-0 bg-[#ececec]">
        <header className="shrink-0 border-b border-divider bg-white">
          <Navbar height="60px" maxWidth="full" className="mx-auto max-w-full">
            <NavbarContent justify="start">
              <Button isIconOnly size="md" variant="light" onPress={handleToggleSidebar}>
                <IoReorderThree size={24} className="text-default-500" />
              </Button>
              <Button size="md" onClick={toggleModal}>
                <MdOutlineSettingsSuggest size="24" />
                <span>Settings</span>
              </Button>
            </NavbarContent>
            <NavbarContent justify="end" className="items-center">
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className={cn("flex items-center gap-2 rounded-xl py-2 px-3 outline-none transition-colors", "hover:bg-neutral-100 active:bg-neutral-200")}>
                      <Avatar
                        size="md"
                        src={data?.data?.photoProfile}
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-default-700 leading-tight">
                          {data?.data?.username}
                        </span>
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem
                      key="help_and_feedback"
                      startContent={<Icon icon="solar:help-linear" width={18} height={18} className="text-default-500" />}
                    >
                      Help &amp; Feedback
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={<Icon icon="solar:logout-3-linear" width={18} height={18} className="text-danger" />}
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </header>
        <main className="flex-1 overflow-auto min-w-0">
          <div className="w-full min-h-full overflow-x-hidden">{children}</div>
        </main>
      </div>
    </div>
  );
}