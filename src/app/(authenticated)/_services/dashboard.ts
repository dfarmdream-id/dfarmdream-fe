"use client";
import { useHttp } from "@/hooks/http";
import {
  DashboardChartResponse, DashboardEggChartResponse,
  DashboardSummaryResponse,
  LdrListDataResonse,
} from "../_models/response/dashboard";

export const useDashboardSummary = ({
  date,
  cageId,
}: {
  date: string | null;
  cageId: string | null;
}) => {
  return useHttp<DashboardSummaryResponse>("/v1/dashboard", {
    params: {
      date,
      cageId,
    },
  });
};

export const useDashboardChart = ({ cageId }: { cageId: string | null }) => {
  return useHttp<DashboardChartResponse>("/v1/dashboard/chart", {
    params: {
      cageId,
    },
  });
};

export const useDashboardChartEgg = ({ groupBy }: { groupBy: string }) => {
  return useHttp<DashboardEggChartResponse>("/v1/dashboard/chart-egg", {
    params: {
      groupBy,
    },
  });
};

export const useGetLdrData = ({cageId}:{cageId:string | null})=>{
  return useHttp<LdrListDataResonse>("/v1/sensor/ldr",{
    params:{
      cageId
    }
  })
}