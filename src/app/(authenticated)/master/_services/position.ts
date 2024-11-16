"use client";
import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  GetPositionListResponse,
  GetPositionResponse,
} from "../_models/response/position";
import { useMemo } from "react";

export const useGetPositions = (params: Record<string, string>) => {
  return useHttp<GetPositionListResponse>("/v1/position", {
    params,
  });
};

export const useCreatePosition = () => {
  return useHttpMutation("/v1/position", {
    method: "POST",
  });
};

export const useDeletePosition = () => {
  return useHttpMutation("/v1/position/{id}", {
    method: "DELETE",
  });
};

export const useUpdatePosition = () => {
  return useHttpMutation("/v1/position/{id}", {
    method: "PUT",
  });
};

export const useGetPosition = (id: string) => {
  return useHttp<GetPositionResponse>(
    useMemo(() => `/v1/position/${id}`, [id])
  );
};
