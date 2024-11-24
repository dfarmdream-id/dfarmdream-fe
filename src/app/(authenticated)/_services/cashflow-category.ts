"use client";
import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  GetCashFlowCategoryListResponse,
  GetCashFlowCategoryResponse,
} from "../master/_models/response/cash-flow-category";
import { useMemo } from "react";

export const useGetCashFlowCategories = (params: Record<string, string>) => {
  return useHttp<GetCashFlowCategoryListResponse>("/v1/cash-flow-category", {
    params,
  });
};

export const useCreateCashFlowCategory = () => {
  return useHttpMutation("/v1/cash-flow-category", {
    method: "POST",
  });
};

export const useDeleteCashFlowCategory = () => {
  return useHttpMutation("/v1/cash-flow-category/{id}", {
    method: "DELETE",
  });
};

export const useUpdateCashFlowCategory = () => {
  return useHttpMutation("/v1/cash-flow-category/{id}", {
    method: "PUT",
  });
};

export const useGetCashFlowCategory = (id: string) => {
  return useHttp<GetCashFlowCategoryResponse>(
    useMemo(() => `/v1/cash-flow-category/${id}`, [id])
  );
};
