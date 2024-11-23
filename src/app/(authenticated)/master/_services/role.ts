import { useHttp, useHttpMutation } from "@/hooks/http";
import { RoleListResponse, GetRoleResponse } from "../_models/response/role";
import { useMemo } from "react";

export const useGetRoles = (params: Record<string, string>) => {
  return useHttp<RoleListResponse>("/v1/role", {
    params,
  });
};

export const useCreateRole = () => {
  return useHttpMutation<GetRoleResponse>("/v1/role", {
    method: "POST",
  });
};

export const useDeleteRole = () => {
  return useHttpMutation<GetRoleResponse>("/v1/role/{id}", {
    method: "DELETE",
  });
};

export const useUpdateRole = () => {
  return useHttpMutation<GetRoleResponse>("/v1/role/{id}", {
    method: "PUT",
  });
};

export const useGetRole = (id: string) => {
  return useHttp<GetRoleResponse>(useMemo(() => `/v1/role/${id}`, [id]));
};
