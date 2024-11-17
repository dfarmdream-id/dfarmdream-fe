"use client";
import { useHttp } from "@/hooks/http";
import {
  DashboardChartResponse,
  DashboardSummaryResponse,
} from "../_models/response/dashboard";

export const useDashboardSummary = () => {
  return useHttp<DashboardSummaryResponse>("/v1/dashboard");
};

export const useDashboardChart = () => {
  return useHttp<DashboardChartResponse>("/v1/dashboard/chart");
};
