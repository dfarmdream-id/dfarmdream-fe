"use client";
import { Chip, Select, SelectItem } from "@nextui-org/react";
import { ReactNode, useMemo, useState } from "react";
import { useGetCages } from "../../_services/cage";
import { HiSun } from "react-icons/hi2";
import { useGetLdrData } from "../../_services/dashboard";
import {DateTime} from 'luxon'

export default function IotDevices({ children }: { children: ReactNode }) {
  const [cage, setCage] = useState<string | null>(null);

  const items = useGetLdrData(
    useMemo(() => ({ cageId: cage || "" }), [cage])
  );

  const sensors = useMemo(() => {
    if (items.data) {
      return items.data?.data || [];
    }
    return [];
  }, [items.data]);

  const cages = useGetCages(
    useMemo(() => {
      return {
        page: "1",
        limit: "100",
      };
    }, [])
  );

  const currentTimeWIB = DateTime.local().setZone('Asia/Jakarta');
  const currentHour = currentTimeWIB.hour;
  const currentMinute = currentTimeWIB.minute;
  const isLampOff =  (currentHour >= 21 || currentHour < 4 || (currentHour === 4 && currentMinute <= 30))

  return (
    <div className="grid bg-white rounded-lg p-5 gap-3">
      <div>{children}</div>
      <div className="flex flex-col items-center">
        <div className="grid gap-3 max-w-3xl w-full">
          <Select
            isLoading={cages.isLoading}
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
      <ul className="py-5 grid gap-5 lg:grid-cols-3 xl:grid-cols-5">
        {sensors &&
          sensors.map((x, index) => (
            <li
              key={x.code}
              className="flex gap-3 items-center border-primary border-4 p-3 rounded-md"
            >
              <div className="w-8 h-8 md:w-16 md:h-16 bg-primary text-white flex justify-center items-center aspect-square rounded-lg">
                <div>
                  <HiSun className="w-5 h-5 md:w-8 md:h-8" />
                </div>
              </div>
              <div className="w-full">
                <div className="font-bold">Lampu {index + 1}</div>
                {(isLampOff || x.lastestValue < x.IotSensor.ldrThreshold) ? <Chip color="danger">Mati</Chip> : <Chip color="primary">Hidup</Chip>}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}