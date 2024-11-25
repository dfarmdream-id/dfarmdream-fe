"use client";
import { Chip, Select, SelectItem } from "@nextui-org/react";
import { ReactNode, useMemo } from "react";
import { useGetCages } from "../../_services/cage";
import { useGetSites } from "../../_services/site";
import { HiSun } from "react-icons/hi2";

export default function IotDevices({ children }: { children: ReactNode }) {
  const sites = useGetSites(
    useMemo(() => {
      return {
        page: "1",
        limit: "100",
      };
    }, [])
  );

  const cages = useGetCages(
    useMemo(() => {
      return {
        page: "1",
        limit: "100",
      };
    }, [])
  );

  return (
    <div className="grid bg-white rounded-lg p-5 gap-3">
      <div>{children}</div>
      <div className="flex flex-col items-center">
        <div className="grid md:grid-cols-2 gap-3 max-w-3xl w-full">
          <Select
            isLoading={sites.isLoading}
            variant="bordered"
            placeholder="Pilih lokasi"
          >
            {sites.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
          <Select
            isLoading={cages.isLoading}
            variant="bordered"
            placeholder="Pilih kandang"
          >
            {cages.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
        </div>
      </div>
      <ul className="py-5 grid gap-5 md:grid-cols-3 lg:grid-cols-5">
        {Array.from({
          length: 10,
        }).map(() => {
          return (
            <li
              key={Math.random()}
              className="flex gap-3 items-center border-primary border-4 p-3 rounded-md"
            >
              <div className="w-8 h-8 md:w-16 md:h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
                <div>
                  <HiSun className="w-5 h-5 md:w-8 md:h-8" />
                </div>
              </div>
              <div className="w-full">
                <div className="font-bold">Lampu 1</div>
                <Chip color="primary">Hidup</Chip>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
