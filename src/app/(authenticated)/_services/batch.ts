import { useHttp, useHttpMutation } from "@/hooks/http";
import { BatchListResponse, GetBatchResponse } from "../_models/response/batch";
import { useMemo } from "react";

export const useGetBatchs = (params: Record<string, string | null>) => {
  return useHttp<BatchListResponse>("/v1/batch", {
    params,
  });
};

export const useCreateBatch = () => {
  return useHttpMutation<GetBatchResponse>("/v1/batch", {
    method: "POST",
  });
};

export const useDeleteBatch = () => {
  return useHttpMutation<GetBatchResponse>("/v1/batch/{id}", {
    method: "DELETE",
  });
};

export const useUpdateBatch = () => {
  return useHttpMutation<GetBatchResponse>("/v1/batch/{id}", {
    method: "PUT",
  });
};

export const useGetBatch = (id: string) => {
  return useHttp<GetBatchResponse>(
    useMemo(() => `/v1/batch/${id}`, [id])
  );
};

export const useSwitchBatch = () => {
  return useHttpMutation<GetBatchResponse>("/v1/batch/{id}/switch", {
    method: "PUT",
  });
};
