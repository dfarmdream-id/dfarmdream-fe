import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetListPersediaanBarangResponse, GetPersediaanBarangResponse } from "../_models/response/persediaan-barang";

export const useGetListPersediaanBarang = (params: Record<string, string>) => {
  return useHttp<GetListPersediaanBarangResponse>("/v1/persediaan-barang", {
    params,
  });
};

export const useCreatePersediaanBarang = () => {
  return useHttpMutation<GetPersediaanBarangResponse>("/v1/persediaan-barang", {
    method: "POST",
  });
};

export const useDeletePersediaanBarang = () => {
  return useHttpMutation<GetPersediaanBarangResponse>("/v1/persediaan-barang/{id}", {
    method: "DELETE",
  });
};

export const useUpdatePersediaanBarang = () => {
  return useHttpMutation<GetPersediaanBarangResponse>("/v1/persediaan-barang/{id}", {
    method: "PUT",
  });
};

export const useGetPersediaanBarang = (id: string) => {
  return useHttp<GetPersediaanBarangResponse>(useMemo(() => `/v1/persediaan-barang/${id}`, [id]));
};