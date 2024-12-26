"use client";

import { createRef, useMemo, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import ReactHlsPlayer from "react-hls-player";
import { useGetCCTVByCage } from "@/app/(authenticated)/_services/cctv";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import EmptyState from "@/components/state/empty";

export default function CctvDevice() {
  const [kandang, setKandang] = useState<string | null>("me");

  const {
    data: cages,
    isLoading: isLoadingCages,
  } = useGetCages(
    useMemo(() => {
      return {
        page: "1",
        limit: "100",
      };
    }, [])
  );

  const {
    data: cctv,
    isLoading: isLoadingCctv,
  } = useGetCCTVByCage(
    useMemo(() => kandang as string, [kandang])
  );

  return (
    <Card>
      <CardBody>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">Live CCTV Kandang</h2>
          </div>
          <Select
            variant="bordered"
            placeholder="Pilih kandang"
            isLoading={isLoadingCages}
            onChange={(e) => setKandang(e.target.value)}
            className="max-w-xs bg-white text-black"
          >
            {cages?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
        </div>

        {/* Container utama untuk horizontal scroll */}
        <div className="overflow-x-auto flex gap-4">
          {isLoadingCctv && <Spinner />}

          {cctv?.data &&
            cctv?.data?.map((item) => {
              const ref = createRef<HTMLVideoElement>();

              return (
                <Card
                  key={item.id}
                  className="shadow-lg rounded-lg overflow-hidden border border-gray-200 flex-none w-[300px]"
                >
                  {/* Card Header */}
                  <CardHeader className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-600 to-gray-400 text-white">
                    <div className="flex items-center space-x-2">
                      {/* Camera Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 3m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" />
                        <path d="M12 14m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                        <path d="M19 7v7a7 7 0 0 1 -14 0v-7" />
                        <path d="M12 14l.01 0" />
                      </svg>
                      <p className="text-sm font-semibold">{item?.name}</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  {/* Card Body */}
                  <CardBody className="p-0 bg-gray-100">
                    <ReactHlsPlayer
                      playerRef={ref}
                      src={item.ipAddress}
                      autoPlay={false}
                      controls={true}
                      // Atur size video agar lebih kecil
                      width="100%"
                      height="200px"
                      className="rounded-lg object-cover"
                    />
                  </CardBody>
                </Card>
              );
            })}

          {/* Jika tidak loading dan data CCTV kosong, tampilkan EmptyState */}
          {!isLoadingCctv && cctv?.data?.length === 0 && (
            <div className="text-center w-full">
              <EmptyState />
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}