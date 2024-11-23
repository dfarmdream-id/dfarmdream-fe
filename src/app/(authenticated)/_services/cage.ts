import { useHttp, useHttpMutation } from "@/hooks/http";
import { CageListResponse, GetCageResponse } from "../master/_models/response/cage";
import { useMemo } from "react";

export const useGetCages = (params: Record<string, string>) => {
  return useHttp<CageListResponse>("/v1/chicken-cage", {
    params,
  });
};

export const useCreateCage = () => {
  return useHttpMutation<GetCageResponse>("/v1/chicken-cage", {
    method: "POST",
  });
};

export const useDeleteCage = () => {
  return useHttpMutation<GetCageResponse>("/v1/chicken-cage/{id}", {
    method: "DELETE",
  });
};

export const useUpdateCage = () => {
  return useHttpMutation<GetCageResponse>("/v1/chicken-cage/{id}", {
    method: "PUT",
  });
};

export const useGetCage = (id: string) => {
  return useHttp<GetCageResponse>(
    useMemo(() => `/v1/chicken-cage/${id}`, [id])
  );
};
