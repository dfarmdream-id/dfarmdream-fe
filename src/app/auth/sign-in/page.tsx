"use client";
import Logo from "@/components/assets/logo";
import {
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen grid grid-cols-2 p-3">
      <Card className="bg-primary">
        <CardBody className="flex justify-center items-center">
          <div>
            <Logo />
          </div>
        </CardBody>
      </Card>
      <div className="flex justify-center items-center p-5">
        <div className="w-full">
          <form action="/dashboard" className="w-full max-w-lg mx-auto">
            <div className="text-2xl mb-20">Welcome Back👋</div>
            <div className="h-20">
              <Input
                labelPlacement="outside"
                label="Email/Username"
                placeholder="Email/Username"
              />
            </div>
            <div className="h-20">
              <Input
                type="password"
                labelPlacement="outside"
                label="Password"
                placeholder="Password"
              />
            </div>
            <div className="h-20">
              <Select
                labelPlacement="outside"
                label="Lokasi"
                placeholder="Lokasi"
              >
                <SelectItem key={1}>Majalengka</SelectItem>
              </Select>
            </div>
            <Button as={Link} href="/dashboard" color="primary" className="w-full">
              <span>Sign In</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
