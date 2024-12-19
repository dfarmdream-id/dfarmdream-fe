import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  ChickenDiseaseListResponse,
  ChickenDiseaseResponse,
} from "../_models/response/chicken-diseases";

export const useGetChickenDiseases = (params: Record<string, string>) => {
  return useHttp<ChickenDiseaseListResponse>("/v1/chickendisease", {
    params,
  });
};

export const useGetChickenDisease = (id: string) => {
  return useHttp<ChickenDiseaseResponse>(`/v1/chickendisease/${id}`);
};

export const useDeleteChickenDisease = () => {
  return useHttpMutation("/v1/chickendisease/{id}", {
    method: "DELETE",
  });
};

export const useUpdateChickenDisease = () => {
  return useHttpMutation<ChickenDiseaseResponse>("/v1/chickendisease/{id}", {
    method: "PUT",
  });
};

export const useCreateChickenDisease = () => {
  return useHttpMutation<ChickenDiseaseResponse>("/v1/chickendisease", {
    method: "POST",
  });
};
