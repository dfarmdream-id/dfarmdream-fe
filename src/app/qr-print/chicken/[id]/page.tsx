"use client";
import Logo from "@/components/assets/logo";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import { useSearchParam } from "react-use";
import {useEffect, useMemo} from "react";
import {useGetChicken} from "@/app/(authenticated)/_services/chicken";

export default function Verify() {
  const params = useParams();
  const print = useSearchParam("print");
  const data = useGetChicken(useMemo(() => params.id as string, [params.id]));

  useEffect(() => {
    if (data.isSuccess) {
      if (print == "true") {
        window.print();
      }
    }
  }, [data, print]);

  return (
    <div>
      <div className="print:hidden flex justify-center items-center">
        <Logo />
      </div>
      <div className="print:hidden flex justify-center items-center flex-col gap-5">
        <h1 className="text-2xl font-semibold">Data Ayam</h1>
        <table className="w-full">
          <tbody>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Lokasi</td>
            <td className="px-3 py-1">
              {
                data?.data?.data?.rack?.cage?.site?.name
              }
            </td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Kandang</td>
            <td className="px-3 py-1">
              {
                data?.data?.data?.rack?.cage?.name
              }
            </td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Rack</td>
            <td className="px-3 py-1">
              {
                data?.data?.data?.rack?.name
              }
            </td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Batch</td>
            <td className="px-3 py-1">
              {
                data?.data?.data?.batch?.name
              }
            </td>
          </tr>
          </tbody>
        </table>
        {" "}
      </div>
      <div className="hidden items-center w-full gap-5 print:flex">
        <div className="w-1/3">
          <QRCode
            className="w-full h-fit"
            value={`rack|${data.data?.data?.id}`}
          />
        </div>
        <div className="flex-1">
          <table className="w-full">
            <tbody>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Lokasi</td>
              <td className="px-3 py-1">
                {
                  data?.data?.data?.rack?.cage?.site?.name
                }
              </td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Kandang</td>
              <td className="px-3 py-1">
                {
                  data?.data?.data?.rack?.cage?.name
                }
              </td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Rack</td>
              <td className="px-3 py-1">
                {
                  data?.data?.data?.rack?.name
                }
              </td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Batch</td>
              <td className="px-3 py-1">
                {
                  data?.data?.data?.batch?.name
                }
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
