"use client";
import Logo from "@/components/assets/logo";
import { Avatar, Button, Card, CardBody, cn } from "@nextui-org/react";
import Link from "next/link";
import {
  HiArrowRightOnRectangle,
  HiCircleStack,
  HiInbox,
  HiOutlineHome,
  HiUserPlus,
  HiUsers,
} from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { useGetProfile } from "./_services/profile";
import { signOut } from "./sign-out/_actions/sign-out";
import { usePathname } from "next/navigation";
import { HiInboxIn, HiLocationMarker, HiMenuAlt2, HiMenuAlt4, HiX } from "react-icons/hi";
import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetProfile();

  const menus = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <HiOutlineHome />,
    },
    {
      label: "Master Data",
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
          label: "Investor",
          href: "/master/investors",
          icon: <HiUserPlus />,
        },
        {
          label: "Ayam",
          href: "/master/chickens",
          icon: <HiCircleStack />,
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

  const path = usePathname();

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
          <ul className="p-3 space-y-2">
            {menus.map((menu) => (
              <li key={menu.label}>
                <Card
                  as={menu.href ? Link : "a"}
                  href={menu.href ? menu.href : undefined}
                  isPressable
                  onPress={() => {
                    menu?.action?.();
                  }}
                  className={cn(
                    "w-full",
                    path === menu.href
                      ? "bg-secondary/90"
                      : "bg-transparent text-white"
                  )}
                >
                  <CardBody className="flex gap-2 flex-row items-center">
                    {menu.icon}
                    {menu.label}
                  </CardBody>
                </Card>
                {menu.children && (
                  <ul className="p-3 space-y-2">
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
                  </ul>
                )}
              </li>
            ))}
          </ul>
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
          <ul className="p-3 space-y-2">
            {menus.map((menu) => (
              <li key={menu.label}>
                <Card
                  as={menu.href ? Link : "a"}
                  href={menu.href ? menu.href : undefined}
                  isPressable
                  onPress={() => {
                    menu?.action?.();
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full",
                    path === menu.href
                      ? "bg-secondary/90"
                      : "bg-transparent text-white"
                  )}
                >
                  <CardBody className="flex gap-2 flex-row items-center">
                    {menu.icon}
                    {menu.label}
                  </CardBody>
                </Card>
                {menu.children && (
                  <ul className="p-3 space-y-2">
                    {menu.children.map((child) => (
                      <li key={child.label}>
                        <Card
                          as={Link}
                          href={child.href}
                          isPressable
                          data-active={child.href === path}
                          onPress={() => {
                            console.log(open);
                            setOpen(false);
                          }}
                          className="w-full bg-transparent text-white data-[active=true]:bg-secondary/90 data-[active=true]:text-primary"
                        >
                          <CardBody className="flex gap-2 flex-row items-center">
                            {child.icon}
                            {child.label}
                          </CardBody>
                        </Card>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
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
                <Card shadow="none" isPressable className="p-1">
                  <CardBody className="flex flex-row items-center gap-2 px-1 py-0">
                    <Avatar />
                    {data?.data?.fullName}
                  </CardBody>
                </Card>
              </div>
            </div>
          </nav>
          <div className="w-full overflow-x-hidden overflow-y-auto">{children}</div>
        </main>
      </div>
    </AnimatePresence>
  );
}
