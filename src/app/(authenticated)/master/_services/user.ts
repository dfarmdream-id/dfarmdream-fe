import { useHttp, useHttpMutation } from "@/hooks/http";
import { UserListResponse, UserResponse } from "../_models/response/user";
import { useMemo } from "react";

export const useGetUsers = (params: Record<string, string>) => {
  return useHttp<UserListResponse>("/v1/user", {
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

export const useUpdateUser = () => {
  return useHttpMutation<UserResponse>("/v1/user/{id}", {
    method: "PUT",
  });
};

export const useGetUser = (id: string) => {
  return useHttp<UserResponse>(useMemo(() => `/v1/user/${id}`, [id]));
};
