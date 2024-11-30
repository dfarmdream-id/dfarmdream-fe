import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetListPenerimaanModalResponse, GetPenerimaanModalResponse } from "../_models/response/penerimaan-modal";

export const useGetListPenerimaanModal = (params: Record<string, string>) => {
  return useHttp<GetListPenerimaanModalResponse>("/v1/penerimaan-modal", {
    params,
  });
};

export const useCreatePenerimaanModal = () => {
  return useHttpMutation<GetPenerimaanModalResponse>("/v1/penerimaan-modal", {
    method: "POST",
  });
};

export const useDeletePenerimaanModal = () => {
  return useHttpMutation<GetPenerimaanModalResponse>("/v1/penerimaan-modal/{id}", {
    method: "DELETE",
  });
};

export const useUpdatePenerimaanModal = () => {
  return useHttpMutation<GetPenerimaanModalResponse>("/v1/penerimaan-modal/{id}", {
    method: "PUT",
  });
};

export const useGetPenerimaanModal = (id: string) => {
  return useHttp<GetPenerimaanModalResponse>(useMemo(() => `/v1/penerimaan-modal/${id}`, [id]));
};