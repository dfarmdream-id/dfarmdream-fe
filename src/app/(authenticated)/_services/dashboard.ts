"use client";
import {useHttp} from "@/hooks/http";
import {DashboardChartResponse, DashboardSummaryResponse,} from "../_models/response/dashboard";

export const useDashboardSummary = ({
                                      date,
                                      cageId,
                                    }: {
  date: string;
  cageId: string;
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
  cageId: string;
}) => {
  return useHttp<DashboardChartResponse>("/v1/dashboard/chart", {
    params: {
      cageId,
    },
  });
};
