import { useHttp, useHttpMutation } from "@/hooks/http";
import { UserResponse } from "../_models/response/user";

export const useGetUsers = (params: Record<string, string>) => {
  return useHttp<UserResponse>("/v1/user", {
    params,
  });
};

export const useCreateUser = () => {
  return useHttpMutation<UserResponse>("/v1/user", {
    method: "POST",
  });
};

export const useDeleteUser = () => {
  return useHttpMutation<UserResponse>("/v1/user/{id}", {
    method: "DELETE",
  });
};
