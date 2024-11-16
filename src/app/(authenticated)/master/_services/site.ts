import { useHttp, useHttpMutation } from "@/hooks/http";
import { GetSiteResponse } from "../_models/response/site";

export const useGetSites = (params: Record<string, string>) => {
  return useHttp<GetSiteResponse>("/v1/site", {
    params,
  });
};

export const useCreateSite = () => {
  return useHttpMutation("/v1/site", {
    method: "POST",
  });
};
