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
  HiChevronRight
} from "react-icons/hi2";
import { AnimatePresence, motion } from "framer-motion";
import { useGetProfile } from "./_services/profile";
import { usePathname, useRouter } from "next/navigation";
import {
  HiMenuAlt2,
  HiMenuAlt4,
  HiX,
} from "react-icons/hi";
import { useEffect, useState } from "react";
import { Can } from "@/components/acl/can";
import { useAuthStore } from "../auth/_store/auth";
import Link from "next/link";
import SwitchSite from "./_components/switch-site";
import useLocationStore from "@/stores/useLocationStore";
import {menus} from "@/common/menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetProfile();

  const { setPermissions } = useAuthStore((state) => state);
  const { setSiteId } = useLocationStore();
  const router = useRouter();

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

  const handleNavigation = (href: string) => {
    router.push(href);
    setOpen(false); // Close sidebar after navigation
  };

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

    const [open, setOpen] = useState(
      menu?.id?.includes(path.split("/")[1]) || false
    );

    return (
      <li key={menu.label}>
        <Card
          isPressable
          onPress={() => {
            if (menu.href) {
              handleNavigation(menu.href); // Use the handleNavigation function
            } else if (menu.action) {
              menu.action(); // Run action if no href
            }
            setOpen(!open); // Toggle submenu
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
                                if (child.href) {
                                  handleNavigation(child.href); // Use handleNavigation
                                } else if (menu.action) {
                                  menu.action();
                                }
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
                                  if (child.href) {
                                    handleNavigation(child.href); // Use handleNavigation
                                  } else if (menu.action) {
                                    menu.action();
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
                    {!open ? <HiMenuAlt4 /> : <HiMenuAlt2 />}  </Button>
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