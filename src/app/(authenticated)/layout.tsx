"use client";
import Logo from "@/components/assets/logo";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  cn,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  ScrollShadow,
} from "@nextui-org/react";
import Link from "next/link";
import {
  HiArrowRightOnRectangle,
  HiBars3,
  HiChevronRight,
  HiCircleStack,
  HiClock,
  HiCurrencyDollar,
  HiInbox,
  HiListBullet,
  HiOutlineHome,
  HiUserPlus,
  HiUsers,
  HiWindow,
} from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { useGetProfile } from "./_services/profile";
import { signOut } from "./sign-out/_actions/sign-out";
import { usePathname } from "next/navigation";
import {
  HiDatabase,
  HiInboxIn,
  HiLocationMarker,
  HiMenuAlt2,
  HiMenuAlt4,
  HiReceiptTax,
  HiX,
} from "react-icons/hi";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetProfile();

  const SidebarMenuItem = (menu: {
    href?: string;
    label?: string;
    icon?: React.ReactNode;
    action?: () => void;
    children?: { href: string; label: string; icon: React.ReactNode }[];
  }) => {
    const [open, setOpen] = useState(false);

    const path = usePathname();

    return (
      <li key={menu.label}>
        <Card
          as={menu.href ? Link : "a"}
          href={menu.href ? menu.href : undefined}
          isPressable
          onPress={() => {
            setOpen(!open);
            menu?.action?.();
          }}
          className={cn(
            "w-full",
            path === menu.href ? "bg-secondary/90" : "bg-transparent text-white"
          )}
        >
          <CardBody className="flex gap-2 flex-row items-center justify-between">
            <div className="flex gap-2 flex-row items-center">
              {menu.icon}
              {menu.label}
            </div>
            {menu.children ? (
              <motion.div animate={{ rotate: open ? 90 : 0 }}>
                <HiChevronRight />
              </motion.div>
            ) : null}
          </CardBody>
        </Card>
        <motion.div>
          {open && (
            <AnimatePresence>
              {menu.children && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 space-y-2"
                >
                  {menu.children.map((child) => (
                    <li key={child.label}>
                      <Card
                        as={Link}
                        href={child.href}
                        isPressable
                        data-active={child.href === path}
                        className="w-full bg-transparent text-white data-[active=true]:bg-secondary/90 data-[active=true]:text-primary"
                      >
                        <CardBody className="flex gap-2 flex-row items-center">
                          {child.icon}
                          {child.label}
                        </CardBody>
                      </Card>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </li>
    );
  };

  const menus = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <HiOutlineHome />,
    },
    {
      icon: <HiReceiptTax />,
      label: "Transaksi",
      children: [
        {
          label: "Transaksi Gudang",
          href: "/master/warehouse-transactions",
          icon: <HiWindow />,
        },
        {
          label: "Transaksi Penjualan",
          href: "/master/sales-transactions",
          icon: <HiCurrencyDollar />,
        },
      ],
    },
    {
      icon: <HiClock />,
      label: "Operasional",
      children: [
        {
          label: "Kandang",
          href: "/master/cages",
          icon: <HiInbox />,
        },
        {
          label: "Rak",
          href: "/master/cage-racks",
          icon: <HiInboxIn />,
        },
        {
          label: "Ayam",
          href: "/master/chickens",
          icon: <HiCircleStack />,
        },
      ],
    },
    {
      icon: <HiCurrencyDollar />,
      label: "Arus Kas",
      children: [
        {
          label: "Jenis Arus Kas",
          href: "/master/cash-flow-category",
          icon: <HiListBullet />,
        },
        {
          label: "Arus Kas",
          href: "/master/cash-flow",
          icon: <HiCurrencyDollar />,
        },
      ],
    },
    {
      icon: <HiDatabase />,
      label: "Data Master",
      children: [
        {
          label: "Jabatan",
          href: "/master/positions",
          icon: <HiUsers />,
        },
        {
          label: "Pengguna",
          href: "/master/users",
          icon: <HiUsers />,
        },
        {
          label: "Lokasi",
          href: "/master/site",
          icon: <HiLocationMarker />,
        },
        {
          label: "Investor",
          href: "/master/investors",
          icon: <HiUserPlus />,
        },
        {
          label: "Harga",
          href: "/master/prices",
          icon: <HiBars3 />,
        },
      ],
    },
    {
      label: "Sign Out",
      href: "/sign-out",
      icon: <HiArrowRightOnRectangle />,
      action: signOut,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      <div className="flex w-full h-screen overflow-hidden">
        <motion.aside
          initial={{ width: "20rem" }}
          animate={{ width: open ? 0 : "20rem" }}
          className="w-80 h-screen bg-primary hidden md:block overflow-hidden"
        >
          <div className="h-20 flex justify-center items-center">
            <Logo className="h-16" />
          </div>
          <ScrollShadow className="h-full" hideScrollBar>
            <ul className="p-3 space-y-2 h-[calc(100vh-20rem)]">
              {menus.map((menu) => {
                return (
                  <SidebarMenuItem
                    href={menu.href as string}
                    key={menu.label}
                    {...menu}
                  />
                );
              })}
            </ul>
          </ScrollShadow>
        </motion.aside>
        <motion.aside
          initial={{ width: "0" }}
          animate={{ width: open ? "100%" : "0" }}
          className="h-dvh bg-primary block md:hidden overflow-hidden"
        >
          <div className="h-20 flex justify-between items-center px-5">
            <div>
              <Logo className="h-16" />
            </div>
            <div>
              <Button
                isIconOnly
                variant="light"
                onPress={() => {
                  console.log(open);
                  setOpen(false);
                }}
              >
                <HiX className="text-2xl text-white" />
              </Button>
            </div>
          </div>
          <ScrollShadow className="h-full" hideScrollBar>
            <ul className="p-3 space-y-2 h-[calc(100vh-20rem)]">
              {menus.map((menu) => {
                return (
                  <SidebarMenuItem
                    href={menu.href as string}
                    key={menu.label}
                    {...menu}
                  />
                );
              })}
            </ul>
          </ScrollShadow>
        </motion.aside>
        <main className="flex-1 bg-default-50 w-full overflow-y-auto">
          <nav className="bg-white w-full sticky top-0 h-16 flex justify-center items-center px-5 z-30">
            <div className="w-full flex justify-between items-center">
              <div>
                <Button
                  variant="light"
                  isIconOnly
                  onClick={() => setOpen(!open)}
                >
                  {!open ? <HiMenuAlt4 /> : <HiMenuAlt2 />}
                </Button>
              </div>
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <Card shadow="none" isPressable className="p-1">
                      <CardBody className="flex flex-row items-center gap-2 px-1 py-0">
                        <Avatar />
                        {data?.data?.fullName}
                      </CardBody>
                    </Card>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Actions">
                    <DropdownItem
                      key="delete"
                      className="text-danger"
                      color="danger"
                      onPress={() => signOut()}
                    >
                      Keluar
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>
          </nav>
          <div className="w-full overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </main>
      </div>
    </AnimatePresence>
  );
}
