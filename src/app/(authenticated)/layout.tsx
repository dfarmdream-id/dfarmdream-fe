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
  ScrollShadow,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "usehooks-ts";

// Framer Motion
import { AnimatePresence, motion } from "framer-motion";

// Services / Stores
import { useGetProfile } from "./_services/profile";
import { useAuthStore } from "../auth/_store/auth";
import useLocationStore from "@/stores/useLocationStore";

// Components
import Logo from "@/components/assets/logo";
import { sectionNestedItems } from "@/components/ui/sidebar-items";

import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("@/components/ui/sidebar"), { ssr: false });

export default function Layout({ children }: { children: React.ReactNode }) {
  // Ambil data profil (roles, site, dll.)
  const { data } = useGetProfile();

  // Global states (permissions & site)
  const { setPermissions } = useAuthStore();
  const { setSiteId } = useLocationStore();

  // State: menandakan sidebar sedang "terbuka" (true) atau "tertutup" (false)
  // - Di desktop => true = w-72, false = w-16
  // - Di mobile => true = overlay terbuka, false = overlay tertutup
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Deteksi mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Handler toggle sidebar
  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  // Sinkronisasi data roles & site -> permissions & siteId
  useEffect(() => {
    if (!data?.data) return;
    const { roles, site } = data.data;

    // Set permissions
    if (roles?.length > 0) {
      setPermissions(
        roles.flatMap((role) =>
          role.role.permissions.map((p) => p.permission.code)
        )
      );
    }
    // Set siteId
    if (site?.id) {
      setSiteId(site.id);
    }
  }, [data, setPermissions, setSiteId]);
  
  // Pastikan Anda memiliki akses ke state `isSidebarOpen` & fungsi penutup 
  // (misalnya setIsSidebarOpen(false)) di dalam scope sidebarContent.
  const sidebarContent = (
    <>
      {/* Header area: Logo + Tombol X di baris yang sama */}
      <div className={
        cn(
          "flex items-center",
          isMobile ? "justify-between px-2" : "justify-center"
        )
      }>
        {/* Logo */}
        {(!isSidebarOpen) ? (
          <Image
            className="h-10"
            src="/icon.png"
            alt="Logo Compact"
          />
        ) : (
          <Logo className="h-16" />
        )}

        {/* Tombol X hanya muncul jika mobile & isSidebarOpen (opsional) */}
        {isMobile && isSidebarOpen && (
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsSidebarOpen(false)}
          >
            <Icon
              icon="solar:close-circle-outline"
              width={24}
              height={24}
              className="text-default-500"
            />
          </Button>
        )}
      </div>

      {/* Menu Sidebar */}
      <ScrollShadow hideScrollBar>
        <Sidebar
          defaultSelectedKey="home"
          // Di desktop => isCompact jika !isSidebarOpen
          // Di mobile => overlay menampilkan full, 
          //   tapi Anda masih bisa memanfaatkan isCompact sesuai kebutuhan
          isCompact={!isSidebarOpen && !isMobile}
          items={sectionNestedItems}
        />
      </ScrollShadow>
    </>
  );


  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* 
        MOBILE => OVERLAY
        DESKTOP => ASIDE
      */}
      {isMobile ? (
        // ======== MOBILE: AnimatePresence + motion.div sebagai Drawer Overlay ========
        <AnimatePresence>
          {isSidebarOpen && (
            <div className="fixed inset-0 z-50 flex">
              {/* BACKDROP → Fade In/Out */}
              <motion.div
                className="absolute inset-0 bg-black/30"
                // Awal (invisible), lalu fade in
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* SIDEBAR → Slide In/Out dari kiri */}
              <motion.aside
                className="relative z-50 w-72 border-r border-divider bg-white p-2"
                // Awal (x:-288), lalu geser ke 0
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
        // ========== DESKTOP => <aside> normal (collapse/expand) ==========
        <aside
          className={cn(
            "relative flex flex-col h-full border-r border-divider p-2 transition-[width]",
            isSidebarOpen ? "w-72" : "w-16 items-center px-2 py-6"
          )}
        >
          {sidebarContent}
        </aside>
      )}

      {/* WRAPPER UTAMA (HEADER + MAIN) */}
      <div className="flex flex-1 flex-col min-w-0 bg-[#ececec]">
        {/* HEADER */}
        <header className="shrink-0 border-b border-divider bg-white">
          <Navbar height="60px" maxWidth="full" className="mx-auto max-w-full">
            {/* Tombol toggle sidebar */}
            <NavbarContent justify="start">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={handleToggleSidebar}
              >
                <Icon
                  className="text-default-500"
                  icon="solar:sidebar-minimalistic-outline"
                  width={24}
                  height={24}
                />
              </Button>
            </NavbarContent>

            {/* Bagian Kanan (settings, profile) */}
            <NavbarContent justify="end" className="items-center space-x-1">
              {/* Settings Button */}
              <NavbarItem className="hidden sm:flex">
                <Button isIconOnly radius="full" variant="light">
                  <Icon
                    className="text-default-500"
                    icon="solar:settings-linear"
                    width={24}
                  />
                </Button>
              </NavbarItem>

              {/* Profile Avatar & Dropdown */}
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div
                      className={cn(
                        "flex items-center gap-2 rounded-xl py-2 px-3 outline-none transition-colors",
                        "hover:bg-neutral-100 active:bg-neutral-200"
                      )}
                    >
                      <Avatar
                        size="md"
                        src={
                          data?.data?.photoProfile ??
                          "https://i.pravatar.cc/150?u=a04258114e29026708c"
                        }
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-default-700 leading-tight">
                          {data?.data?.username ?? "User"}
                        </span>
                      </div>
                    </div>
                  </DropdownTrigger>

                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem
                      key="help_and_feedback"
                      startContent={
                        <Icon
                          icon="solar:help-linear"
                          width={18}
                          height={18}
                          className="text-default-500"
                        />
                      }
                    >
                      Help &amp; Feedback
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      startContent={
                        <Icon
                          icon="solar:logout-3-linear"
                          width={18}
                          height={18}
                          className="text-danger"
                        />
                      }
                    >
                      Log Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            </NavbarContent>
          </Navbar>
        </header>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-auto min-w-0">
          <div className="w-full min-h-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
