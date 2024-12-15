import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetJournalResponse, GetListJournalResponse, GetJournalBalanceSheetResponse } from "../_models/response/journal";

export const useGetListJournal = (params: Record<string, string>) => {
  return useHttp<GetListJournalResponse>("/v1/journal", {
    params,
  });
};

export const useCreateJournal = () => {
  return useHttpMutation<GetJournalResponse>("/v1/journal", {
    method: "POST",
  });
};

export const useDeleteJournal = () => {
  return useHttpMutation<GetJournalResponse>("/v1/journal/{id}", {
    method: "DELETE",
  });
};
 
export const useUpdateJournal = (id: string) => {
  return useHttpMutation<GetJournalResponse>(useMemo(() => `/v1/journal/${id}`, [id]), {
    method: "PUT",
  });
};

export const useGetJournal = (id: string) => {
  return useHttp<GetJournalResponse>(useMemo(() => `/v1/journal/${id}`, [id]));
};

export const useGetJournalBalanceSheet = (params: Record<string, string>) => {
  return useHttp<GetJournalBalanceSheetResponse>("/v1/journal/balance-sheets", {
    params,
  });
}