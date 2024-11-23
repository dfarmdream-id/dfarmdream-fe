"use client";
import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  GetCashFlowListResponse,
  GetCashFlowResponse,
} from "../master/_models/response/cash-flow";
import { useMemo } from "react";

export const useGetCashFlows = (params: Record<string, string>) => {
  return useHttp<GetCashFlowListResponse>("/v1/cash-flow", {
    params,
  });
};

export const useCreateCashFlow = () => {
  return useHttpMutation("/v1/cash-flow", {
    method: "POST",
  });
};

export const useDeleteCashFlow = () => {
  return useHttpMutation("/v1/cash-flow/{id}", {
    method: "DELETE",
  });
};

export const useUpdateCashFlow = () => {
  return useHttpMutation("/v1/cash-flow/{id}", {
    method: "PUT",
  });
};

export const useGetCashFlow = (id: string) => {
  return useHttp<GetCashFlowResponse>(
    useMemo(() => `/v1/cash-flow/${id}`, [id])
  );
};
