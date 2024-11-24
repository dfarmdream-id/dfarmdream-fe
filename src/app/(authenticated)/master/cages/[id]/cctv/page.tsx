"use client";

import { useMemo } from "react";
import { useGetCCTVByCage } from "../../../../_services/cctv"
import { useParams } from "next/navigation";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import ReactHlsPlayer from "react-hls-player";

export default function ViewCCTVPage() {
  const params = useParams();

  const cctv = useGetCCTVByCage(
    useMemo(() => params.id as string, [params.id])
  );

  const rows = useMemo(() => {
    if (cctv.data) {
      return cctv.data?.data || [];
    }
    return [];
  }, [cctv.data]);

  return (
    <div className="px-4 py-4">
      <div className="text-2xl font-bold mb-10">Live CCTV Kandang</div>

      <div className="grid grid-cols-12 gap-4">
        {rows &&
          rows.map((item) => (
            <Card className="col-span-4" key={item.id}>
              <CardHeader className="flex gap-3">
                <p className="text-md">{item?.name}</p>
              </CardHeader>
              <Divider />
              <CardBody>
                <ReactHlsPlayer
                  src={item.ipAddress}
                  autoPlay={false}
                  controls={true}
                  width="100%"
                  height="auto"
                />
              </CardBody>
              <Divider />
            </Card>
          ))}
      </div>
    </div>
  );
}
