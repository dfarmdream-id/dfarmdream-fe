import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetListGoodResponse, GetGoodResponse } from "../_models/response/good";

export const useGetListGood = (params: Record<string, string | null>) => {
  return useHttp<GetListGoodResponse>("/v1/goods", {
    params,
  });
};

export const useCreateGood = () => {
  return useHttpMutation<GetGoodResponse>("/v1/goods", {
    method: "POST",
  });
};

export const useDeleteGood = () => {
  return useHttpMutation<GetGoodResponse>("/v1/goods/{id}", {
    method: "DELETE",
  });
};

export const useUpdateGood = () => {
  return useHttpMutation<GetGoodResponse>("/v1/goods/{id}", {
    method: "PUT",
  });
};

export const useGetGood = (id: string) => {
  return useHttp<GetGoodResponse>(useMemo(() => `/v1/goods/${id}`, [id]));
};