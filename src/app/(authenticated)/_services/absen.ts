import { useHttp, } from "@/hooks/http";
import {AbsenListResponse, AbsenLogResponse} from "../_models/response/absen";

export const useGetAbsen = (params: Record<string, string>) => {
  return useHttp<AbsenListResponse>("/v1/absen", {
    params,
  });
};

export const useGetAbsenLog = (params: Record<string, string>) => {
  return useHttp<AbsenLogResponse>("/v1/absen/log", {
    params,
  })
}
