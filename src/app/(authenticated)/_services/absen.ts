import { useHttp, } from "@/hooks/http";
import { AbsenListResponse } from "../_models/response/absen";

export const useGetAbsen = (params: Record<string, string>) => {
  return useHttp<AbsenListResponse>("/v1/absen", {
    params,
  });
};
