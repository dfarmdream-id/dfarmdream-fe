import { useHttp } from "@/hooks/http";
import {GetListJournalTypeResponse} from "@/app/(authenticated)/_models/response/journal-type";

export const useGetListJournalType = (params: Record<string, string>) => {
  return useHttp<GetListJournalTypeResponse>("/v1/journal-type", {
    params,
  });
};