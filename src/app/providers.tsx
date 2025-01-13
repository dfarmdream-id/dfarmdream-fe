"use client";

import { NextUIProvider, Spinner } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import GlobalSettings from "@/app/(authenticated)/_components/settings";
import Cookies from "js-cookie";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const token = Cookies.get("accessToken");
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
              position="bottom-center"
            />
            <ProgressBar
              height="4px"
              color="#0d6647"
              options={{ showSpinner: false }}
              
              shallowRouting
            />
            {
              token && <GlobalSettings />
            }
            {children}
          </Suspense>
        </NuqsAdapter>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
