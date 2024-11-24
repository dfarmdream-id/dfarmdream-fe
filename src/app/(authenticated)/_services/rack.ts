import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  CageRackListResponse,
  GetRackResponse,
} from "../_models/response/rack";
import { useMemo } from "react";

export const useGetCageRacks = (params: Record<string, string>) => {
  return useHttp<CageRackListResponse>("/v1/chicken-cage-rack", {
    params,
  });
};

export const useCreateCageRack = () => {
  return useHttpMutation<GetRackResponse>("/v1/chicken-cage-rack", {
    method: "POST",
  });
};

export const useDeleteCageRack = () => {
  return useHttpMutation<GetRackResponse>("/v1/chicken-cage-rack/{id}", {
    method: "DELETE",
  });
};

export const useUpdateCageRack = () => {
  return useHttpMutation<GetRackResponse>("/v1/chicken-cage-rack/{id}", {
    method: "PUT",
  });
};

export const useGetCageRack = (id: string) => {
  return useHttp<GetRackResponse>(
    useMemo(() => `/v1/chicken-cage-rack/${id}`, [id])
  );
};
