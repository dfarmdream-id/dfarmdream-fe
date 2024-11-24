"use client";
import Logo from "@/components/assets/logo";
import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import InvestorSignIn from "../_components/investor-sign-in";
import UserSignIn from "../_components/user-sign-in";

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-secondary/20 to-primary/20 flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 py-10 bg-white max-w-screen-lg mx-auto w-full rounded-xl">
        <div className="flex justify-center items-center order-2 md:order-1">
          <div className="w-full p-5">
            <Tabs variant="bordered">
              <Tab title="Pengguna">
                <UserSignIn />
              </Tab>
              <Tab title="Investor">
                <InvestorSignIn />
              </Tab>
            </Tabs>
          </div>
        </div>
        <Card className="bg-primary flex justify-center items-center p-8 order-1 md:order-1">
          <CardBody className="flex justify-center items-center">
            <Logo className="lg:h-40 w-auto" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
