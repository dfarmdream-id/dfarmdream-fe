import { useHttpMutation } from "@/hooks/http";
import { UploadFileResponse } from "../../_models/response/file";

export const useUpdateProfile = () => {
  return useHttpMutation<any>("/v1/auth/update-profile", {
    method: "POST",
  });
};

export const useUpdatePassword = () => {
  return useHttpMutation<any>("/v1/auth/update-password", {
    method: "POST",
  });
};

export const useUploadImage = () => {
  return useHttpMutation<FormData, UploadFileResponse>("v1/file/upload", {
    method: "POST",
  });
};
