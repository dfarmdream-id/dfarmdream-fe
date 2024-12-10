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
  Skeleton, Tooltip,
} from "@nextui-org/react";
import {
  HiBookmark, HiBookOpen,
  HiChevronRight,
  HiEye,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
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
import { GiChicken } from "react-icons/gi";
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
import { MdOutlineCollectionsBookmark, MdOutlineDeviceThermostat, MdSensors } from "react-icons/md";
import Link from "next/link";
import { VscVariableGroup } from "react-icons/vsc";
import {FaBalanceScale, FaBox, FaMoneyBillAlt} from "react-icons/fa";
import { TbCashRegister } from "react-icons/tb";
import SwitchSite from "./_components/switch-site";
import { PiDotDuotone } from "react-icons/pi";
import useLocationStore from "@/stores/useLocationStore";
export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetProfile();

  const { setPermissions } = useAuthStore((state) => state);
  const { setSiteId } = useLocationStore();

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

  useEffect(() => {
    if (data?.data?.site?.id) {
      setSiteId(data?.data?.site?.id);
    }
  }, [data, setSiteId]);

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
            "shadow-lg w-full data-[active=true]:bg-primary data-[active=true]:text-[#F4E9B1] py-1 bg-transparent text-primary md:text-gray-600"
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
                  className={cn(
                    menu.expanded ? "p-3 space-y-2" : "p-1 space-y-1"
                  )}
                >
                  {menu.childrens.map((child) => (
                    <li key={child.label}>
                      {
                        menu.expanded ? (
                          <Can action={child.can || ""}>
                            <Card
                              shadow="none"
                              onPress={() => {
                                /*if (menu.mobile) {
                                  menu.onClick?.();
                                }*/
                                menu.action?.();
                                router.push(child.href || "");
                              }}
                              as={child.href ? Link : "a"}
                              href={child.href ? child.href : undefined}
                              isPressable
                              data-active={child.href == path}
                              className="py-1 w-full bg-transparent text-primary md:text-gray-600 data-[active=true]:bg-primary/90 data-[active=true]:text-[#F4E9B1]"
                            >
                              <CardBody className="flex gap-2 flex-row items-center test">
                                {child.icon}
                                {menu.expanded ? child.label : !menu.mobile ? null : child.label}
                              </CardBody>
                            </Card>
                          </Can>
                        ) : (
                          <Can action={child.can || ""}>
                            <Tooltip
                              content={child.label}
                              placement="right"
                              offset={10}
                            >
                              <Card
                                shadow="none"
                                onPress={() => {
                                  /*if (menu.mobile) {
                                    menu.onClick?.();
                                  }*/
                                  menu.action?.();
                                  router.push(child.href || "");

                                  if (menu.mobile) {
                                    menu.onClick?.();
                                  }
                                }}
                                as={child.href ? Link : "a"}
                                href={child.href ? child.href : undefined}
                                isPressable
                                data-active={child.href == path}
                                className="py-1 w-full bg-transparent text-primary md:text-gray-600 data-[active=true]:bg-primary/90 data-[active=true]:text-[#F4E9B1]"
                              >
                                <CardBody className="flex gap-2 flex-row items-center kedu">
                                  {child.icon}
                                  {menu.expanded ? child.label : !menu.mobile ? null : child.label}
                                </CardBody>
                              </Card>
                            </Tooltip>
                          </Can>
                        )
                      }
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
          label: "Perangkat IOT",
          href: "/operational/iot",
          icon: <MdSensors className="text-xl" />,
          can: "show:sensor-iot",
        },
        {
          label: "Sensor IOT",
          href: "/operational/sensor-device",
          icon: <MdOutlineDeviceThermostat className="text-xl" />,
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
          icon: <GiChicken className="text-xl" />,
        },
      ],
    },
    {
      can: "show:cash-flow",
      icon: <HiOutlineCurrencyDollar className="text-xl" />,
      label: "Keuangan",
      key: "cash",
      children: [
        {
          can: "show:penerimaan-modal",
          label: "Penerimaan Modal",
          href: "/cash/penerimaan-modal",
          icon: <TbCashRegister className="text-xl" />,
        },
        {
          can: "show:kategori-biaya",
          label: "Kategori Biaya",
          href: "/cash/kategori-biaya",
          icon: <VscVariableGroup className="text-xl" />,
        },
        {
          can: "show:biaya",
          label: "Biaya",
          href: "/cash/biaya",
          icon: <FaMoneyBillAlt className="text-xl" />,
        },
        {
          can: "show:group-coa",
          label: "Group COA",
          href: "/cash/group-coa",
          icon: <HiOutlineListBullet className="text-xl" />,
        },
        {
          can: "show:coa",
          label: "COA",
          href: "/cash/coa",
          icon: <HiOutlineListBullet className="text-xl" />,
        },
        {
          can:"show:journal-type",
          label:"Journal Type",
          href:"/cash/journal-type",
          icon:<MdOutlineCollectionsBookmark className="text-xl" />
        },
        {
          can: "show:template-journal-and-detail",
          label: "Template Jurnal dan Detail",
          href: "/cash/template-journal",
          icon: <HiBookmark className="text-xl" />,
        },
        {
          can: "show:journal",
          label: "Jurnal",
          href: "/cash/journal",
          icon: <HiBookOpen  className="text-xl" />,
        },
        {
          can: "show:balance-sheet",
          label: "Neraca",
          href: "/cash/balance-sheet",
          icon: <FaBalanceScale className="text-xl" />,
        },
      ],
    },
    {
      can: "show:persediaan-barang",
      icon: <FaBox className="text-xl" />,
      label: "Barang",
      key: "cash",
      children: [
        {
          can: "show:persediaan-barang",
          label: "Persediaan Barang",
          href: "/stock/persediaan-barang",
          icon: <PiDotDuotone className="text-xl" />,
        },
        {
          can: "show:kartu-stok",
          label: "Kartu Stok Pakan Obat",
          href: "/stock/transaksi",
          icon: <PiDotDuotone className="text-xl" />,
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
      can: "signout",
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
          className="w-80 h-screen bg-[#F8F9FA] hidden md:block overflow-hidden pb-10"
        >
          <ScrollShadow offset={0} className="h-full" hideScrollBar>
            <ul className="p-3 space-y-2 h-[calc(100vh-20rem)]">
              <li className="h-20 flex justify-center items-center sticky top-0 inset-x-0 z-[50] bg-white/90 backdrop-blur-xl">
                {open ? (
                  <Image className="h-16" src="/icon.png" alt="logo" />
                ) : (
                  <Logo className="h-16" />
                )}
              </li>
              {menus.map((menu) => {
                return (
                  <Can
                    key={menu.label}
                    action={menu.can || ""}
                    loader={
                      <div className="flex gap-4 h-16 relative justify-center items-center p-4">
                        <Skeleton className="w-full h-full absolute z-0 rounded-xl" />
                        <div>
                          <Skeleton className="w-8 h-8 rounded-xl" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <Skeleton className="w-full h-2 rounded-xl" />
                          <Skeleton className="w-full h-2 rounded-xl" />
                        </div>
                      </div>
                    }
                  >
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
          className="h-dvh bg-[#F8F9FA] block md:hidden overflow-hidden"
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
                  setOpen(false);
                }}
              >
                <HiX className="text-2xl text-primary" />
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
              <div className="flex gap-3 w-full items-center">
                <div>
                  <Button
                    variant="light"
                    isIconOnly
                    onClick={() => setOpen(!open)}
                  >
                    {!open ? <HiMenuAlt4 /> : <HiMenuAlt2 />}
                  </Button>
                </div>
                <SwitchSite />
              </div>
              <div>
                <Dropdown>
                  <DropdownTrigger>
                    <Card shadow="none" isPressable className="p-1">
                      <CardBody className="flex flex-row items-center gap-2 px-1 py-0">
                        <Avatar src={data?.data?.photoProfile} />
                        {data?.data?.fullName}
                      </CardBody>
                    </Card>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Actions">
                    <DropdownItem key="update-profile" color="danger">
                      <Link href="/user/update-profile">Update Profile</Link>
                    </DropdownItem>
                    <DropdownItem key="update-password" color="danger">
                      <Link href="/user/update-password">Update Password</Link>
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
