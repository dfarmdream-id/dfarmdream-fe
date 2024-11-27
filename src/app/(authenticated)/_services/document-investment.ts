import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  DocumentInvestmentListResponse,
  DocumentInvestmentResponse,
} from "../_models/response/document-investment";

export const useGetDocumentInvestments = (params: Record<string, string>) => {
  return useHttp<DocumentInvestmentListResponse>("/v1/document-investment", {
    params,
  });
};

export const useGetDocumentInvestment = (id: string) => {
  return useHttp<DocumentInvestmentResponse>(`/v1/document-investment/${id}`);
};

export const useDeleteDocumentInvestment = () => {
  return useHttpMutation("/v1/document-investment/{id}", {
    method: "DELETE",
  });
};

export const useUpdateDocumentInvestment = () => {
  return useHttpMutation<DocumentInvestmentResponse>(
    "/v1/document-investment/{id}",
    {
      method: "PUT",
    }
  );
};

export const useCreateDocumentInvestment = () => {
  return useHttpMutation<DocumentInvestmentResponse>(
    "/v1/document-investment",
    {
      method: "POST",
    }
  );
};
