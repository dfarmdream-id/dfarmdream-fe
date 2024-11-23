import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  ChickenListResponse,
  ChickenResponse,
} from "../master/_models/response/chicken";

export const useGetChickens = (params: Record<string, string>) => {
  return useHttp<ChickenListResponse>("/v1/chicken", {
    params,
  });
};

export const useGetChicken = (id: string) => {
  return useHttp<ChickenResponse>(`/v1/chicken/${id}`);
};

export const useDeleteChicken = () => {
  return useHttpMutation("/v1/chicken/{id}", {
    method: "DELETE",
  });
};

export const useUpdateChicken = () => {
  return useHttpMutation<ChickenResponse>("/v1/chicken/{id}", {
    method: "PUT",
  });
};

export const useCreateChicken = () => {
  return useHttpMutation<ChickenResponse>("/v1/chicken", {
    method: "POST",
  });
};
