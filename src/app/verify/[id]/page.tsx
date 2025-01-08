"use client";
import Logo from "@/components/assets/logo";
import { useGetWarehouseTransactionPublic } from "../../(authenticated)/_services/warehouse-transaction";
import { useParams } from "next/navigation";
import { DateTime } from "luxon";
import QRCode from "react-qr-code";
import { useSearchParam } from "react-use";
import { useEffect } from "react";

export default function Verify() {
  const params = useParams();
  const print = useSearchParam("print");
  const data = useGetWarehouseTransactionPublic(params.id as string);

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
        <h1 className="text-2xl font-semibold">Data Panen</h1>
        <table className="w-full">
          <tbody>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Lokasi</td>
            <td className="px-3 py-1">{data?.data?.data?.site?.name}</td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Kandang</td>
            <td className="px-3 py-1">
              {data?.data?.data?.cage?.name}
            </td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Batch</td>
            <td className="px-3 py-1">
              {data?.data?.data?.batch?.name}
            </td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Jenis</td>
            <td className="px-3 py-1">Telur</td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Jumlah</td>
            <td className="px-3 py-1">{data?.data?.data?.qty} Butir</td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Berat Total</td>
            <td className="px-3 py-1">{data?.data?.data?.weight} KG</td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Karyawan Panen</td>
            <td className="px-3 py-1">
              {data.data?.data?.createdBy?.fullName}
            </td>
          </tr>
          <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
            <td className="px-3 py-1 w-1/4">Tanggal Panen</td>
            <td className="px-3 py-1 overflow-hidden ">
              <div className="w-full overflow-hidden truncate">
                {DateTime.fromISO(data.data?.data?.createdAt || "").toFormat(
                  "dd-MM-yyyy"
                )}
              </div>
            </td>
          </tr>
          {/*<tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">*/}
          {/*  <td className="px-3 py-1 w-1/4">*/}
          {/*    Harga{" "}*/}
          {/*    {data.data?.data?.category == "CHICKEN" ? "Ayam" : "Telur"} Pada{" "}*/}
          {/*    {DateTime.fromISO(*/}
          {/*      data.data?.data?.price?.createdAt || ""*/}
          {/*    ).toFormat("dd-MM-yyyy")}*/}
          {/*  </td>*/}
          {/*  <td className="px-3 py-1 overflow-hidden ">*/}
          {/*    <div className="w-full overflow-hidden truncate">*/}
          {/*      {IDR(data.data?.data?.price?.value || 0)} /Kg*/}
          {/*    </div>*/}
          {/*  </td>*/}
          {/*</tr>*/}
          {/*<tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">*/}
          {/*  <td className="px-3 py-1 w-1/4">Total Harga</td>*/}
          {/*  <td className="px-3 py-1 overflow-hidden ">*/}
          {/*    <div className="w-full overflow-hidden truncate">*/}
          {/*      {IDR(*/}
          {/*        (data.data?.data?.price?.value ?? 0) **/}
          {/*          (data.data?.data?.weight ?? 0) || 0*/}
          {/*      )}*/}
          {/*    </div>*/}
          {/*  </td>*/}
          {/*</tr>*/}
          </tbody>
        </table>
        {" "}
      </div>
      <div className="hidden items-center w-full gap-5 print:flex">
        <div className="w-1/3">
          <QRCode
            className="w-full h-fit"
            value={`https://dfarmdream.id/verify/${data.data?.data?.id}`}
          />
        </div>
        <div className="flex-1">
          <table className="w-full">
            <tbody>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Lokasi</td>
              <td className="px-3 py-1">{data?.data?.data?.site?.name}</td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Kandang</td>
              <td className="px-3 py-1">
                {data?.data?.data?.cage?.name}
              </td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Batch</td>
              <td className="px-3 py-1">
                {data?.data?.data?.batch?.name}
              </td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Jenis</td>
              <td className="px-3 py-1">Telur</td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Jumlah</td>
              <td className="px-3 py-1">{data?.data?.data?.qty} Butir</td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Berat Total</td>
              <td className="px-3 py-1">{data?.data?.data?.weight} KG</td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Karyawan Panen</td>
              <td className="px-3 py-1">
                {data.data?.data?.createdBy?.fullName}
              </td>
            </tr>
            <tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">
              <td className="px-3 py-1 w-1/4">Tanggal Panen</td>
              <td className="px-3 py-1 overflow-hidden ">
                <div className="w-full overflow-hidden truncate">
                  {DateTime.fromISO(
                    data.data?.data?.createdAt || ""
                  ).toFormat("dd-MM-yyyy")}
                </div>
              </td>
            </tr>
            {/*<tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">*/}
            {/*  <td className="px-3 py-1 w-1/4">*/}
            {/*    Harga{" "}*/}
            {/*    {data.data?.data?.category == "CHICKEN" ? "Ayam" : "Telur"}{" "}*/}
            {/*    Pada{" "}*/}
            {/*    {DateTime.fromISO(*/}
            {/*      data.data?.data?.price?.createdAt || ""*/}
            {/*    ).toFormat("dd-MM-yyyy")}*/}
            {/*  </td>*/}
            {/*  <td className="px-3 py-1 overflow-hidden ">*/}
            {/*    <div className="w-full overflow-hidden truncate">*/}
            {/*      {IDR(data.data?.data?.price?.value || 0)} /Kg*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            {/*<tr className="p-3 whitespace-nowrap even:bg-white odd:bg-slate-100">*/}
            {/*  <td className="px-3 py-1 w-1/4">Total Harga</td>*/}
            {/*  <td className="px-3 py-1 overflow-hidden ">*/}
            {/*    <div className="w-full overflow-hidden truncate">*/}
            {/*      {IDR(*/}
            {/*        (data.data?.data?.price?.value ?? 0) **/}
            {/*          (data.data?.data?.weight ?? 0) || 0*/}
            {/*      )}*/}
            {/*    </div>*/}
            {/*  </td>*/}
            {/*</tr>*/}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
