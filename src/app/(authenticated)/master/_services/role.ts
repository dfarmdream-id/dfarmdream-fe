import { useHttp } from "@/hooks/http";
import { useMemo } from "react";
import { GetRoleListResponse, GetRoleResponse } from "../_models/response/role";

export const useGetRole = (id: string) => {
  return useHttp<GetRoleResponse>(useMemo(() => `/v1/role/${id}`, [id]));
};

export const useGetRoles = (params: Record<string, string>) => {
  return useHttp<GetRoleListResponse>("/v1/role", {
    params,
  });
};
