import { useHttpMutation } from "@/hooks/http";

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
