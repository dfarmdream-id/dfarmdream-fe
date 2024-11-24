"use client";
import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  GetPriceListResponse,
  GetPriceResponse,
} from "../_models/response/price";
import { useMemo } from "react";

export const useGetPrices = (params: Record<string, string>) => {
  return useHttp<GetPriceListResponse>("/v1/price", {
    params,
  });
};

export const useCreatePrice = () => {
  return useHttpMutation("/v1/price", {
    method: "POST",
  });
};

export const useDeletePrice = () => {
  return useHttpMutation("/v1/price/{id}", {
    method: "DELETE",
  });
};

export const useUpdatePrice = () => {
  return useHttpMutation("/v1/price/{id}", {
    method: "PUT",
  });
};

export const useGetPrice = (id: string) => {
  return useHttp<GetPriceResponse>(useMemo(() => `/v1/price/${id}`, [id]));
};
