import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetKategoriBiayaResponse, GetListKategoriBiayaResponse } from "../_models/response/kategori-biaya";

export const useGetListKategoriBiaya = (params: Record<string, string>) => {
  return useHttp<GetListKategoriBiayaResponse>("/v1/kategori-biaya", {
    params,
  });
};

export const useCreateKategoriBiaya = () => {
  return useHttpMutation<GetKategoriBiayaResponse>("/v1/kategori-biaya", {
    method: "POST",
  });
};

export const useDeleteKategoriBiaya = () => {
  return useHttpMutation<GetKategoriBiayaResponse>("/v1/kategori-biaya/{id}", {
    method: "DELETE",
  });
};

export const useUpdateKategoriBiaya = () => {
  return useHttpMutation<GetKategoriBiayaResponse>("/v1/kategori-biaya/{id}", {
    method: "PUT",
  });
};

export const useGetKategoriBiaya = (id: string) => {
  return useHttp<GetKategoriBiayaResponse>(useMemo(() => `/v1/kategori-biaya/${id}`, [id]));
};