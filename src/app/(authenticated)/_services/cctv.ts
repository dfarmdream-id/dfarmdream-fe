import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetAllCCTVDataResponse, GetCCTVResponse, GetListCCTVResponse } from "../_models/response/cctv";

export const useGetAllCCTV = (params: Record<string, string>) => {
  return useHttp<GetListCCTVResponse>("/v1/cctv", {
    params,
  });
};

export const useCreateCCTV = () => {
  return useHttpMutation<GetCCTVResponse>("/v1/cctv", {
    method: "POST",
  });
};

export const useDeleteCCTV = () => {
  return useHttpMutation<GetCCTVResponse>("/v1/cctv/{id}", {
    method: "DELETE",
  });
};

export const useUpdateCCTV = () => {
  return useHttpMutation<GetCCTVResponse>("/v1/cctv/{id}", {
    method: "PUT",
  });
};

export const useGetCCTV = (id: string) => {
  return useHttp<GetCCTVResponse>(
    useMemo(() => `/v1/cctv/${id}`, [id])
  );
};

export const useGetCCTVByCage = (cageId:string)=>{
  return useHttp<GetAllCCTVDataResponse>(
    useMemo(()=>`v1/cctv/${cageId}/cage`,[cageId])
  );
}