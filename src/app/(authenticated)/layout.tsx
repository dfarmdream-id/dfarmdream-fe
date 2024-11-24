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
  Image,
  ScrollShadow,
} from "@nextui-org/react";
import {
  HiChevronRight,
  HiEye,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineCircleStack,
  HiOutlineClock,
  HiOutlineCog6Tooth,
  HiOutlineCurrencyDollar,
  HiOutlineHome,
  HiOutlineInbox,
  HiOutlineListBullet,
  HiOutlineRocketLaunch,
  HiOutlineUserPlus,
  HiOutlineUsers,
  HiOutlineWindow,
} from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { useGetProfile } from "./_services/profile";
import { signOut } from "./sign-out/_actions/sign-out";
import { usePathname, useRouter } from "next/navigation";
import {
  HiMenuAlt2,
  HiMenuAlt4,
  HiOutlineDatabase,
  HiOutlineInboxIn,
  HiOutlineLocationMarker,
  HiOutlineReceiptTax,
  HiX,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Can } from "@/components/acl/can";
import { useAuthStore } from "../auth/_store/auth";
import { MdSensors } from "react-icons/md";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetProfile();

  const { setPermissions } = useAuthStore((state) => state);

  useEffect(() => {
    if (data?.data && data?.data?.roles?.length > 0) {
      setPermissions(
        data?.data?.roles
          .map((role) =>
            role.role.permissions.map(
              (permission) => permission.permission.code
            )
          )
          .flat()
      );
    }
  }, [data, setPermissions]);

  const SidebarMenuItem = (menu: {
    can: string;
    href?: string;
    label?: string;
    icon?: React.ReactNode;
    action?: () => void;
    childrens?: Partial<{
      href: string;
      label: string;
      icon: React.ReactNode;
      can: string;
      key: string;
    }>[];
    expanded?: boolean;
    mobile?: boolean;
    id: string;
    onClick?: () => void;
  }) => {
    const path = usePathname();

    const router = useRouter();

    const [open, setOpen] = useState(
      menu?.id?.includes(path.split("/")[1]) || false
    );

    return (
      <li key={menu.label}>
        <Card
          isPressable
          onPress={() => {
            if (!menu.childrens) {
              menu?.onClick?.();
            }
            setOpen(!open);
            menu.action?.();
            if (menu.href) {
              router.push(menu.href);
            }
          }}
          as={menu.href ? Link : "a"}
          href={menu.href ? menu.href : undefined}
          className={cn(
            "shadow-lg w-full data-[active=true]:bg-primary data-[active=true]:text-[#F4E9B1] py-1 bg-transparent text-white md:text-gray-600"
          )}
          data-active={menu.href == path}
          shadow="none"
        >
          <CardBody
            className={cn(
              "flex gap-2 flex-row items-center w-full",
              menu.expanded ? "justify-between" : "justify-center"
            )}
          >
            {menu.mobile && (
              <div className="flex gap-2 flex-row items-center w-full">
                {menu.icon}
                {menu.label}
              </div>
            )}
            {!menu.mobile && (
              <div className="flex gap-2 flex-row items-center">
                {menu.icon}
                {menu.expanded ? menu.label : null}
              </div>
            )}
            {menu.mobile && (
              <>
                {menu.childrens ? (
                  <motion.div animate={{ rotate: open ? 90 : 0 }}>
                    <HiChevronRight />
                  </motion.div>
                ) : null}
              </>
            )}
            {!menu.mobile && (
              <>
                {menu.childrens && menu.expanded ? (
                  <motion.div animate={{ rotate: open ? 90 : 0 }}>
                    <HiChevronRight />
                  </motion.div>
                ) : null}
              </>
            )}
          </CardBody>
        </Card>
        <motion.div>
          {open && (
            <AnimatePresence>
              {menu.childrens && (
                <motion.ul
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 space-y-2"
                >
                  {menu.childrens.map((child) => (
                    <li key={child.label}>
                      <Can action={child.can || ""}>
                        <Card
                          shadow="none"
                          onPress={() => {
                            if (menu.mobile) {
                              menu.onClick?.();
                            }
                            menu.action?.();
                            router.push(child.href || "");
                          }}
                          as={child.href ? Link : "a"}
                          href={child.href ? child.href : undefined}
                          isPressable
                          data-active={child.href == path}
                          className="py-1 w-full bg-transparent text-white md:text-gray-600 data-[active=true]:bg-primary/90 data-[active=true]:text-[#F4E9B1]"
                        >
                          <CardBody className="flex gap-2 flex-row items-center">
                            {child.icon}
                            {child.label}
                          </CardBody>
                        </Card>
                      </Can>
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
      icon: <HiOutlineHome className="text-xl" />,
      can: "show:dashboard",
    },
    {
      icon: <HiOutlineReceiptTax className="text-xl" />,
      label: "Transaksi",
      key: "transaction",
      can: "show:transaction",
      children: [
        {
          can: "show:warehouse-transaction",
          label: "Transaksi Gudang",
          href: "/transaction/warehouse",
          icon: <HiOutlineWindow className="text-xl" />,
        },
        // {
        //   can: "show:sales-transaction",
        //   label: "Transaksi Penjualan",
        //   href: "/transaction/sales",
        //   icon: <HiOutlineCurrencyDollar className="text-xl" />,
        // },
      ],
    },
    {
      can: "show:operational",
      icon: <HiOutlineClock className="text-xl" />,
      label: "Operasional",
      key: "operational",
      children: [
        {
          can: "show:cages",
          label: "Kandang",
          href: "/operational/cages",
          icon: <HiOutlineInbox className="text-xl" />,
        },
        {
          label: "CCTV",
          href: "/operational/cctv",
          icon: <HiEye className="text-xl" />,
          can: "show:cctv",
        },
        {
          label: "Sensor IOT",
          href: "/operational/iot",
          icon: <MdSensors className="text-xl" />,
          can: "show:sensor-iot",
        },
        {
          can: "show:cage-racks",
          label: "Rak",
          href: "/operational/cage-racks",
          icon: <HiOutlineInboxIn className="text-xl" />,
        },
        {
          can: "show:chickens",
          label: "Ayam",
          href: "/operational/chickens",
          icon: <HiOutlineCircleStack className="text-xl" />,
        },
      ],
    },
    {
      can: "show:cash-flow",
      icon: <HiOutlineCurrencyDollar className="text-xl" />,
      label: "Arus Kas",
      key: "cash",
      children: [
        {
          can: "show:cash-flow-category",
          label: "Jenis Arus Kas",
          href: "/cash/category",
          icon: <HiOutlineListBullet className="text-xl" />,
        },
        {
          can: "show:cash-flow",
          label: "Arus Kas",
          href: "/cash/cash-flow",
          icon: <HiOutlineCurrencyDollar className="text-xl" />,
        },
      ],
    },
    {
      key: "master",
      can: "show:master",
      icon: <HiOutlineDatabase className="text-xl" />,
      label: "Data Master",
      children: [
        {
          can: "show:positions",
          label: "Jabatan",
          href: "/master/positions",
          icon: <HiOutlineUsers className="text-xl" />,
        },
        {
          can: "show:users",
          label: "Pengguna",
          href: "/master/users",
          icon: <HiOutlineUsers className="text-xl" />,
        },
        {
          can: "show:sites",
          label: "Lokasi",
          href: "/master/site",
          icon: <HiOutlineLocationMarker className="text-xl" />,
        },
        {
          can: "show:investors",
          label: "Investor",
          href: "/master/investors",
          icon: <HiOutlineUserPlus className="text-xl" />,
        },
        {
          can: "show:prices",
          label: "Harga",
          href: "/master/prices",
          icon: <HiOutlineBars3 className="text-xl" />,
        },
        {
          can: "show:roles",
          label: "Role",
          href: "/master/roles",
          icon: <HiOutlineRocketLaunch className="text-xl" />,
        },
        {
          can: "show:permissions",
          label: "Permission",
          href: "/master/permissions",
          icon: <HiOutlineCog6Tooth className="text-xl" />,
        },
      ],
    },
    {
      can:"signout",
      label: "Sign Out",
      href: "/sign-out",
      icon: <HiOutlineArrowRightOnRectangle />,
      action: signOut,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <AnimatePresence>
      <div className="flex w-full h-screen overflow-hidden">
        <motion.aside
          initial={{ width: "20rem" }}
          animate={{ width: open ? "5rem" : "20rem" }}
          className="w-80 h-screen bg-[#F8F9FA] hidden md:block overflow-hidden"
        >
          <div className="h-20 flex justify-center items-center">
            {open ? (
              <Image className="h-16" src="/icon.png" alt="logo" />
            ) : (
              <Logo className="h-16" />
            )}
          </div>
          <ScrollShadow className="h-full" hideScrollBar>
            <ul className="p-3 space-y-2 h-[calc(100vh-20rem)]">
              {menus.map((menu) => {
                return (
                  <Can key={menu.label} action={menu.can || ""}>
                    <SidebarMenuItem
                      id={menu.key || ""}
                      label={menu.label as string}
                      action={menu.action}
                      icon={menu.icon as React.ReactNode}
                      can={menu.can as string}
                      expanded={!open}
                      href={menu.href as string}
                      childrens={menu.children}
                    />
                  </Can>
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
                  <Can key={menu.label} action={menu.can || "show:basic-menu"}>
                    <SidebarMenuItem
                      id={menu.key || ""}
                      onClick={() => setOpen(false)}
                      expanded={!open}
                      mobile
                      href={menu.href as string}
                      label={menu.label as string}
                      action={menu.action}
                      icon={menu.icon as React.ReactNode}
                      can={menu.can as string}
                      childrens={menu.children}
                    />
                  </Can>
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
                      key="update-profile"
                      color="danger"
                    >
                      <Link href="/user/update-profile">
                        Update Profile
                      </Link>
                    </DropdownItem>
                    <DropdownItem
                      key="update-password"
                      color="danger"
                    >
                      <Link href="/user/update-password">
                        Update Password
                      </Link>
                    </DropdownItem>
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
          <div className="w-full overflow-x-hidden overflow-y-auto bg-[#ececec] min-h-screen">
            {children}
          </div>
        </main>
      </div>
    </AnimatePresence>
  );
}
