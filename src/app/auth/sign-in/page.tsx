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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-4 p-5 bg-gray-100">

      <Card className="bg-primary flex justify-center items-center p-8">
        <CardBody className="flex justify-center items-center">
          <Logo className="h-40 w-auto" />
        </CardBody>
      </Card>

      <div className="flex justify-center items-center">
        <div className="w-full max-w-md p-20">
          <form action="/dashboard" className="w-full">
            <div className="text-3xl font-semibold text-center mb-10">Welcome Back 👋</div>
            
            <div className="mb-10">
              <Input
                labelPlacement="outside"
                label="ID"
                placeholder="Email/Username"
                fullWidth
              />
            </div>

            <div className="mb-10">
              <Input
                type="password"
                labelPlacement="outside"
                label="Password"
                placeholder="Password"
                fullWidth
              />
            </div>

            <div className="mb-10">
              <Select
                labelPlacement="outside"
                label="Lokasi"
                placeholder="Lokasi"
                fullWidth
              >
                <SelectItem key={1}>Majalengka</SelectItem>
              </Select>
            </div>

            <Button as={Link} href="/dashboard" color="primary" className="w-full text-lg">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
