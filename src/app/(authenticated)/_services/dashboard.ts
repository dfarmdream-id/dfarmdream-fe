"use client";
import { useHttp } from "@/hooks/http";
import {
  DasboardPersediaanBarangResponse,
  DashboardChartDiseaseResponse,
  DashboardChartResponse,
  DashboardEggChartResponse,
  DashboardKeuanganResponse,
  DashboardSummaryResponse,
  LdrListDataResonse,
} from "../_models/response/dashboard";
import { useMemo } from "react";

export const useDashboardSummary = ({ cageId }: { cageId: string | null }) => {
  return useHttp<DashboardSummaryResponse>("/v1/dashboard", {
    params: {
      cageId,
    },
  });
};

export const useDashboardChart = ({
  date,
  cageId,
}: {
  date: string | null;
  cageId: string | null;
}) => {
  return useHttp<DashboardChartResponse>("/v1/dashboard/chart", {
    params: {
      cageId,
      date,
    },
  });
};

export const useDashboardChartEgg = ({
  groupBy,
  rackId,
  cageId,
  batchId,
  dateRange,
}: {
  groupBy: string;
  rackId: string | null;
  cageId: string | null;
  batchId: string | null;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}) => {
  const params = useMemo(
    () => ({
      groupBy,
      rackId,
      cageId,
      batchId,
      startDate: dateRange.startDate ? dateRange.startDate.toISOString() : null,
      endDate: dateRange.endDate ? dateRange.endDate.toISOString() : null,
    }),
    [groupBy, rackId, cageId, batchId, dateRange]
  );

  return useHttp<DashboardEggChartResponse>("/v1/dashboard/chart-egg", {
    params,
  });
};

export const useDashboardKeuangan = ({
  year,
  cageId,
  batchId,
}: {
  year: string | null;
  cageId: string | null;
  batchId: string | null;
}) => {
  return useHttp<DashboardKeuanganResponse>("/v1/journal/chart-keuangan", {
    params: {
      year,
      cageId,
      batchId,
    },
  });
};

export const useGetDashboardPersediaanBarang = ({
  cageId,
}: {
  cageId: string | null;
}) => {
  return useHttp<DasboardPersediaanBarangResponse>(
    "/v1/persediaan-barang/dashboard",
    {
      params: {
        cageId
      },
    }
  );
};

export const useDashboardChartChicken = ({
  groupBy,
  rackId,
  cageId,
  batchId,
  dateRange,
}: {
  groupBy: string;
  rackId: string | null;
  cageId: string | null;
  batchId: string | null;
  dateRange: {
    startDate: Date | null;
    endDate: Date | null;
  };
}) => {
  const params = useMemo(
    () => ({
      groupBy,
      rackId,
      cageId,
      batchId,
      startDate: dateRange.startDate ? dateRange.startDate.toISOString() : null,
      endDate: dateRange.endDate ? dateRange.endDate.toISOString() : null,
    }),
    [groupBy, rackId, cageId, batchId, dateRange]
  );

  return useHttp<DashboardEggChartResponse>("/v1/dashboard/chart-chicken", {
    params,
  });
};

// useDashboardChartDiease
export const useDashboardChartDisease = ({
  date,
  cageId,
}: {
  date: string | null;
  cageId: string | null;
}) => {
  return useHttp<DashboardChartDiseaseResponse>("/v1/dashboard/chart-disease", {
    params: {
      ...(cageId && { cageId }),
      ...(date && { date }),
    },
  });
};

export const useGetLdrData = ({ cageId }: { cageId: string | null }) => {
  return useHttp<LdrListDataResonse>("/v1/sensor/ldr", {
    params: {
      cageId,
    },
  });
};
