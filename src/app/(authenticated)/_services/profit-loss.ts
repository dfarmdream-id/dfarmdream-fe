import { useHttp } from "@/hooks/http";
import { ProfitLossResponses } from "../_models/response/profit-loss";

export const useGetJournalProfitLoss = (params: Record<string, string>) => {
  return useHttp<ProfitLossResponses>("/v1/profit-loss/profit-loss", {
    params,
  });
}
