"use client";

import { NextUIProvider, Spinner } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "sonner";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <Suspense
            fallback={
              <div className="flex justify-center items-center w-full h-screen">
                <Spinner />
              </div>
            }
          >
            <Toaster
              richColors
              closeButton
              duration={3000}
              position="top-center"
            />
            {children}
          </Suspense>
        </NuqsAdapter>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
