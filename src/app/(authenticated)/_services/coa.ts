import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetCOAResponse, GetListCOAResponse } from "../_models/response/coa";

export const useGetListCOA = (params: Record<string, string>) => {
  return useHttp<GetListCOAResponse>("/v1/coa", {
    params,
  });
};

export const useCreateCOA = () => {
  return useHttpMutation<GetCOAResponse>("/v1/coa", {
    method: "POST",
  });
};

export const useDeleteCOA = () => {
  return useHttpMutation<GetCOAResponse>("/v1/coa/{id}", {
    method: "DELETE",
  });
};

export const useUpdateCOA = () => {
  return useHttpMutation<GetCOAResponse>("/v1/coa/{id}", {
    method: "PUT",
  });
};

export const useGetCOA = (id: string) => {
  return useHttp<GetCOAResponse>(useMemo(() => `/v1/coa/${id}`, [id]));
};