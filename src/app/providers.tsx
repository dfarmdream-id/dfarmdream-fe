"use client";

import { NextUIProvider } from "@nextui-org/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NuqsAdapter>{children}</NuqsAdapter>
    </NextUIProvider>
  );
}
