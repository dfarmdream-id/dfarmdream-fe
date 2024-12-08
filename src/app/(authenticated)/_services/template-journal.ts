import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetTemplateJournalResponse, GetListTemplateJournalResponse } from "../_models/response/template-journal";

export const useGetListTemplateJournal = (params: Record<string, string>) => {
  return useHttp<GetListTemplateJournalResponse>("/v1/journal-template", {
    params,
  });
};

export const useCreateTemplateJournal = () => {
  return useHttpMutation<GetTemplateJournalResponse>("/v1/journal-template", {
    method: "POST",
  });
};

export const useDeleteTemplateJournal = () => {
  return useHttpMutation<GetTemplateJournalResponse>("/v1/journal-template/{id}", {
    method: "DELETE",
  });
};
 
export const useUpdateTemplateJournal = (id: string) => {
  return useHttpMutation<GetTemplateJournalResponse>(useMemo(() => `/v1/journal-template/${id}`, [id]), {
    method: "PUT",
  });
};

export const useGetTemplateJournal = (id: string) => {
  return useHttp<GetTemplateJournalResponse>(useMemo(() => `/v1/journal-template/${id}`, [id]));
};