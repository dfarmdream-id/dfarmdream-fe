"use client";
import { useHttp } from "@/hooks/http";
import {
  DashboardChartDiseaseResponse,
  DashboardChartResponse, DashboardEggChartResponse, DashboardKeuanganResponse,
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

export const useDashboardChartEgg = ({ groupBy, rackId, cageId }: { groupBy: string, rackId: string | null, cageId: string | null }) => {
  return useHttp<DashboardEggChartResponse>("/v1/dashboard/chart-egg", {
    params: {
      groupBy,
      rackId,
      cageId
    },
  });
};

export const useDashboardKeuangan = ({ year }: { year: string | null }) => {
  return useHttp<DashboardKeuanganResponse>("/v1/journal/chart-keuangan", {
    params: {
      year
    },
  });
};

export const useDashboardChartChicken = ({ groupBy, rackId, cageId }: { groupBy: string, rackId: string | null, cageId: string | null }) => {
  return useHttp<DashboardEggChartResponse>("/v1/dashboard/chart-chicken", {
    params: {
      groupBy,
      rackId,
      cageId
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