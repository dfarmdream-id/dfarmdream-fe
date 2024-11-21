import { Image } from "@nextui-org/react";
import * as React from "react";
import Img from "@/assets/images/logo.png";

const Logo = ({ className }: { className?: string }) => (
  <Image className={className} src={Img.src} alt="logo" />
);

export default Logo;
