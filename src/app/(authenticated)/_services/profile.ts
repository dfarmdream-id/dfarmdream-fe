import { useHttp } from "@/hooks/http";
import { ProfileResponse } from "../_models/response/profile";

export const useGetProfile = () => {
  return useHttp<ProfileResponse>("/v1/auth/profile");
};
