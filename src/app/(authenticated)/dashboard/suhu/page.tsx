"use client";

import {Spinner} from "@nextui-org/react";

import { Can } from "@/components/acl/can";

import ForbiddenState from "@/components/state/forbidden";
import GrafikSuhu from "../_components/grafik-suhu";

export default function Page() {
 

  return (
    <Can
      action="show:dashboard"
      loader={
        <div className="min-h-screen flex justify-center items-center">
          <div className="flex justify-center flex-col">
            <Spinner />
            <div>Loading...</div>
          </div>
        </div>
      }
      fallback={<ForbiddenState />}
    >
      <div className="p-5 space-y-5">
        
        <Can action="show:temperature-sensors">
          <GrafikSuhu showTable={false}>Suhu Kandang</GrafikSuhu>
        </Can>
      </div>
    </Can>
  );
}
