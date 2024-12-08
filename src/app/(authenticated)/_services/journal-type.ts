import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { JournalTypeListResponse, JournalTypeResponse } from "../_models/response/journal-type";

export const useGetListJournalType = (params: Record<string, string>) => {
  return useHttp<JournalTypeListResponse>("/v1/journal-type", {
    params,
  });
};

export const useCreateJournalType = () => {
  return useHttpMutation<JournalTypeResponse>("/v1/journal-type", {
    method: "POST",
  });
};

export const useDeleteJournalType = () => {
  return useHttpMutation<JournalTypeResponse>("/v1/journal-type/{id}", {
    method: "DELETE",
  });
};

export const useUpdateJournalType = () => {
  return useHttpMutation<JournalTypeResponse>("/v1/journal-type/{id}", {
    method: "PUT",
  });
};

export const useGetJournalType = (id: string) => {
  return useHttp<JournalTypeResponse>(useMemo(() => `/v1/journal-type/${id}`, [id]));
};