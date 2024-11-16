import { Image } from "@nextui-org/react";
import * as React from "react";

const Logo = ({ className }: { className?: string }) => (
  <Image className={className} src="/logo.png" alt="logo"/>
);

export default Logo;
