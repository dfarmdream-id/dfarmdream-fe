import { useHttp, useHttpMutation } from "@/hooks/http";
import { PermissionListResponse, GetPermissionResponse } from "../_models/response/permission";
import { useMemo } from "react";

export const useGetPermissions = (params: Record<string, string>) => {
  return useHttp<PermissionListResponse>("/v1/permission", {
    params,
  });
};

export const useCreatePermission = () => {
  return useHttpMutation<GetPermissionResponse>("/v1/permission", {
    method: "POST",
  });
};

export const useDeletePermission = () => {
  return useHttpMutation<GetPermissionResponse>("/v1/permission/{id}", {
    method: "DELETE",
  });
};

export const useUpdatePermission = () => {
  return useHttpMutation<GetPermissionResponse>("/v1/permission/{id}", {
    method: "PUT",
  });
};

export const useGetPermission = (id: string) => {
  return useHttp<GetPermissionResponse>(useMemo(() => `/v1/permission/${id}`, [id]));
};
