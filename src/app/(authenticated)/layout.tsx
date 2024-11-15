"use client";
import Logo from "@/components/assets/logo";
import { Card, CardBody } from "@nextui-org/react";
import {
  HiOutlineFolder,
  HiArrowRightOnRectangle,
  HiOutlineHome,
} from "react-icons/hi2";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <aside className="w-80 h-screen bg-primary hidden md:block">
        <div className="h-20 flex justify-center items-center">
          <Logo />
        </div>
        <ul className="p-3 space-y-2">
          <li>
            <Card isPressable className="w-full bg-secondary/90 text-primary">
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
                <Card isPressable className="w-full bg-transparent text-white">
                  <CardBody>Jabatan</CardBody>
                </Card>
              </li>
              <li>
                <Card isPressable className="w-full bg-transparent text-white">
                  <CardBody>Karyawan</CardBody>
                </Card>
              </li>
              <li>
                <Card isPressable className="w-full bg-transparent text-white">
                  <CardBody>Provinsi</CardBody>
                </Card>
              </li>
            </ul>
          </li>
          <li>
            <Card isPressable className="w-full bg-transparent text-white">
              <CardBody className="flex gap-2 flex-row items-center">
                <HiArrowRightOnRectangle />
                Logout
              </CardBody>
            </Card>
          </li>
        </ul>
      </aside>
      <main className="flex-1 bg-default-50">{children}</main>
    </div>
  );
}
