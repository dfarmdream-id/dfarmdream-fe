import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetGroupCOAResponse, GetListGroupCOAResponse } from "../_models/response/group-coa";

export const useGetListGroupCOA = (params: Record<string, string>) => {
  return useHttp<GetListGroupCOAResponse>("/v1/group-coa", {
    params,
  });
};

export const useCreateGroupCOA = () => {
  return useHttpMutation<GetListGroupCOAResponse>("/v1/group-coa", {
    method: "POST",
  });
};

export const useDeleteGroupCOA = () => {
  return useHttpMutation<GetGroupCOAResponse>("/v1/group-coa/{id}", {
    method: "DELETE",
  });
};

export const useUpdateGroupCOA = () => {
  return useHttpMutation<GetGroupCOAResponse>("/v1/group-coa/{id}", {
    method: "PUT",
  });
};

export const useGetGroupCOA = (id: string) => {
  return useHttp<GetGroupCOAResponse>(useMemo(() => `/v1/group-coa/${id}`, [id]));
};