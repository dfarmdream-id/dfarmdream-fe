"use client";

import { NextUIProvider } from "@nextui-org/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <NuqsAdapter>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      </NuqsAdapter>
    </NextUIProvider>
  );
}
