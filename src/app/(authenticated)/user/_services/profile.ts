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

export const useUploadImage = ()=>{
  return useHttpMutation<any>("v1/file/upload",{
    method:"POST"
  })
}