import { useHttp, useHttpMutation } from "@/hooks/http";
import { ProfileResponse } from "../_models/response/profile";
import { MySiteResponse } from "../_models/response/my-site";
import { SignInChooseResponse } from "@/app/auth/_models/response/sign-in";

export const useGetProfile = () => {
  return useHttp<ProfileResponse>("/v1/auth/profile");
};

export const useSwitchSite = () => {
  return useHttpMutation<{ siteId: string }, SignInChooseResponse>(
    "/v1/auth/switch",
    {
      method: "POST",
    }
  );
};

export const useGetSiteAvailable = () => {
  return useHttp<MySiteResponse>("/v1/auth/sites");
};
