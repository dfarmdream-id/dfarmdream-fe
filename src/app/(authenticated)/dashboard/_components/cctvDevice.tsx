"use client";

import {createRef, useMemo, useState} from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Select,
  SelectItem, Spinner,
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
  
  const getCurrentDateTime = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-GB", options).format(now);
  };

  return (
    <Card>
      {/* Grid Layout */}
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
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {
            // Show loading message
            isLoadingCctv && (
              <Spinner />
            )
          }
          {cctv?.data &&
            cctv?.data?.map((item) => {
              const ref = createRef<HTMLVideoElement>();
              const [date, time] = getCurrentDateTime().split(", ");
              return (
                <Card
                  className="shadow-lg rounded-lg overflow-hidden border border-gray-200"
                  key={item.id}
                >
                  {/* Card Header */}
                  <CardHeader
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-600 to-gray-400 text-white">
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
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        />
                        <path d="M3 3m0 1a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z"/>
                        <path d="M12 14m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                        <path d="M19 7v7a7 7 0 0 1 -14 0v-7"/>
                        <path d="M12 14l.01 0"/>
                      </svg>
                      <p className="text-sm font-semibold">{item?.name}</p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      {/* Date Icon */}
                      <div className="flex items-center space-x-1">
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
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          />
                          <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z"/>
                          <path d="M16 3v4"/>
                          <path d="M8 3v4"/>
                          <path d="M4 11h16"/>
                          <path d="M11 15h1"/>
                          <path d="M12 15v3"/>
                        </svg>
                        <p>{date}</p>
                      </div>
                      {/* Time Icon */}
                      <div className="flex items-center space-x-1">
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
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          />
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                          <path d="M12 7v5"/>
                          <path d="M12 12l2 -3"/>
                        </svg>
                        <p>{time}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <Divider/>
                  {/* Card Body */}
                  <CardBody className="p-0 bg-gray-100">
                    <ReactHlsPlayer
                      playerRef={ref}
                      src={item.ipAddress}
                      autoPlay={false}
                      controls={true}
                      width="100%"
                      height="auto"
                      className="rounded-lg"
                    />
                  </CardBody>
                </Card>
              );
            })}
          {
            // Show message if there is no CCTV
            !isLoadingCctv && cctv?.data?.length === 0 && (
              <div className="text-center col-span-3">
                <EmptyState />
              </div>
            )
          }
        </div>
      </CardBody>
    </Card>
  );
}
