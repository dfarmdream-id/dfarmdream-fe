"use client";
import {useHttp} from "@/hooks/http";
import {DashboardChartResponse, DashboardSummaryResponse,} from "../_models/response/dashboard";

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

export const useDashboardChart = ({
                                    cageId,
                                  }: {
  cageId: string | null;
}) => {
  return useHttp<DashboardChartResponse>("/v1/dashboard/chart", {
    params: {
      cageId,
    },
  });
};
