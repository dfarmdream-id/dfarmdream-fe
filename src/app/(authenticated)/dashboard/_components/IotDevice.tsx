"use client";
import { Chip, Select, SelectItem } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { useGetCages } from "../../_services/cage";
import { useGetSites } from "../../_services/site";
import { HiSun } from "react-icons/hi2";
import { useGetHumidityData } from "../../_services/iot-device";

export default function IotDevices({ children }: { children: ReactNode }) {
  const [site, setSite] = useState<string | null>(null);
  const [cage, setCage] = useState<string | null>(null);

  const items = useGetHumidityData(
    useMemo(() => ({ siteId: site || "", cageId: cage || "" }), [site, cage])
  );

  const sensors = useMemo(() => {
    if (items.data) {
      return items.data?.data?.sensors || [];
    }
    return [];
  }, [items.data]);

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
            variant="bordered"
            placeholder="Pilih lokasi"
            onChange={(e) => {
              setSite(e.target.value);
            }}
          >
            {sites.data?.data?.data?.map((site) => (
              <SelectItem key={site.id} value={site.id}>
                {site.name}
              </SelectItem>
            )) || []}
          </Select>
          <Select
            variant="bordered"
            placeholder="Pilih kandang"
            onChange={(e) => {
              setCage(e.target.value);
            }}
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
        {sensors &&
          sensors.map((x, index) => (
            <li
              key={x.code}
              className="flex gap-3 items-center border-primary border-4 p-3 rounded-md"
            >
              <div className="w-16 h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
                <div>
                  <HiSun className="w-8 h-8" />
                </div>
              </div>
              <div className="w-full">
                <div className="font-bold">Lampu {index+1}</div>
                {x.lampStatus==0? <Chip color="danger">Mati</Chip>:<Chip color="primary">Hidup</Chip>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
