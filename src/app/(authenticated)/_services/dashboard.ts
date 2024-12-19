"use client";
import { useHttp } from "@/hooks/http";
import {
  DashboardChartDiseaseResponse,
  DashboardChartResponse, DashboardEggChartResponse,
  DashboardSummaryResponse,
  LdrListDataResonse,
} from "../_models/response/dashboard";

export const useDashboardSummary = ({
  cageId,
}: {
  cageId: string | null;
}) => {
  return useHttp<DashboardSummaryResponse>("/v1/dashboard", {
    params: {
      cageId,
    },
  });
};

export const useDashboardChart = (
  {
    date,
    cageId,
  }: {
    date: string | null;
    cageId: string | null;
  }
) => {
  return useHttp<DashboardChartResponse>("/v1/dashboard/chart", {
    params: {
      cageId,
      date,
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

export const useDashboardChartChicken = ({ groupBy }: { groupBy: string }) => {
  return useHttp<DashboardEggChartResponse>("/v1/dashboard/chart-chicken", {
    params: {
      groupBy,
    },
  });
};

// useDashboardChartDiease
export const useDashboardChartDisease = (
  {
    date,
    cageId,
  }: {
    date: string | null;
    cageId: string | null;
  }
) => {
  return useHttp<DashboardChartDiseaseResponse>("/v1/dashboard/chart-disease", {
    params: {
      ...cageId && { cageId },
      ...date && { date },
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