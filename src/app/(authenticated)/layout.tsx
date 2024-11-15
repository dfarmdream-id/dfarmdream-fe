"use client";
import Logo from "@/components/assets/logo";
import { Avatar, Card, CardBody } from "@nextui-org/react";
import Link from "next/link";
import {
  HiOutlineFolder,
  HiArrowRightOnRectangle,
  HiOutlineHome,
} from "react-icons/hi2";
import { useGetProfile } from "./_services/profile";
import { signOut } from "./sign-out/_actions/sign-out";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { data } = useGetProfile();

  return (
    <div className="flex">
      <aside className="w-80 h-screen bg-primary hidden md:block">
        <div className="h-20 flex justify-center items-center">
          <Logo className="h-16" />
        </div>
        <ul className="p-3 space-y-2">
          <li>
            <Card
              as={Link}
              href="/dashboard"
              isPressable
              className="w-full bg-secondary/90 text-primary"
            >
              <CardBody className="flex gap-2 flex-row items-center">
                <HiOutlineHome />
                Dashboard
              </CardBody>
            </Card>
          </li>
          <li>
            <Card isPressable className="w-full bg-transparent text-white">
              <CardBody className="flex gap-2 flex-row items-center">
                <HiOutlineFolder />
                Master Data
              </CardBody>
            </Card>
            <ul className="p-3 space-y-2">
              <li>
                <Card
                  as={Link}
                  href="/master/users"
                  isPressable
                  className="w-full bg-transparent text-white"
                >
                  <CardBody>Jabatan</CardBody>
                </Card>
              </li>
              <li>
                <Card
                  as={Link}
                  href="/master/users"
                  isPressable
                  className="w-full bg-transparent text-white"
                >
                  <CardBody>Karyawan</CardBody>
                </Card>
              </li>
              <li>
                <Card
                  as={Link}
                  href="/master/users"
                  isPressable
                  className="w-full bg-transparent text-white"
                >
                  <CardBody>Provinsi</CardBody>
                </Card>
              </li>
            </ul>
          </li>
          <li>
            <Card
              onPress={signOut}
              isPressable
              className="w-full bg-transparent text-white"
            >
              <CardBody className="flex gap-2 flex-row items-center">
                <HiArrowRightOnRectangle />
                Logout
              </CardBody>
            </Card>
          </li>
        </ul>
      </aside>
      <main className="flex-1 bg-default-50">
        <nav className="bg-white w-full sticky top-0 h-16 flex justify-center items-center px-5">
          <div className="w-full flex justify-end">
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
        {children}
      </main>
    </div>
  );
}
