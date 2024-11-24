import { useHttp, } from "@/hooks/http";
import { CageListResponse, } from "../master/_models/response/cage";
import { AbsenListResponse } from "../_models/response/absen";

export const useGetAbsen = (params: Record<string, string>) => {
  return useHttp<AbsenListResponse>("/v1/absen", {
    params,
  });
};
