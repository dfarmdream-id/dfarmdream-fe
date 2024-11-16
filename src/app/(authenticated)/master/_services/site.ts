import { useHttp, useHttpMutation } from "@/hooks/http";
import { GetSiteListResponse, GetSiteResponse } from "../_models/response/site";
import { useMemo } from "react";

export const useGetSites = (params: Record<string, string>) => {
  return useHttp<GetSiteListResponse>("/v1/site", {
    params,
  });
};

export const useCreateSite = () => {
  return useHttpMutation("/v1/site", {
    method: "POST",
  });
};

export const useDeleteSite = () => {
  return useHttpMutation("/v1/site/{id}", {
    method: "DELETE",
  });
};

export const useUpdateSite = () => {
  return useHttpMutation("/v1/site/{id}", {
    method: "PUT",
  });
};

export const useGetSite = (id: string) => {
  return useHttp<GetSiteResponse>(useMemo(() => `/v1/site/${id}`, [id]));
};
