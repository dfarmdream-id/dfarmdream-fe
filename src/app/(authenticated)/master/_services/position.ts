"use client";
import { useHttp, useHttpMutation } from "@/hooks/http";
import { GetPositionResponse } from "../_models/response/position";

export const useGetPositions = (params: Record<string, string>) => {
  return useHttp<GetPositionResponse>("/v1/position", {
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
