import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetBiayaResponse, GetListBiayaResponse } from "../_models/response/biaya";

export const useGetListBiaya = (params: Record<string, any>) => {
  return useHttp<GetListBiayaResponse>("/v1/biaya", {
    params,
  });
};

export const useCreateBiaya = () => {
  return useHttpMutation<GetBiayaResponse>("/v1/biaya", {
    method: "POST",
  });
};

export const useDeleteBiaya = () => {
  return useHttpMutation<GetBiayaResponse>("/v1/biaya/{id}", {
    method: "DELETE",
  });
};

export const useUpdateBiaya = () => {
  return useHttpMutation<GetBiayaResponse>("/v1/biaya/{id}", {
    method: "PUT",
  });
};

export const useGetBiaya = (id: string) => {
  return useHttp<GetBiayaResponse>(useMemo(() => `/v1/biaya/${id}`, [id]));
};