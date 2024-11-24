import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  InvestorListResponse,
  InvestorLoginResponse,
  InvestorResponse,
} from "../_models/response/investor";
import Cookies from "js-cookie";

export const useGetInvestors = (params: Record<string, string>) => {
  return useHttp<InvestorListResponse>("/v1/investor", {
    params,
  });
};

export const useGetInvestor = (id: string) => {
  return useHttp<InvestorResponse>(`/v1/investor/${id}`);
};

export const useDeleteInvestor = () => {
  return useHttpMutation("/v1/investor/{id}", {
    method: "DELETE",
  });
};

export const useUpdateInvestor = () => {
  return useHttpMutation<InvestorResponse>("/v1/investor/{id}", {
    method: "PUT",
  });
};

export const useCreateInvestor = () => {
  return useHttpMutation<InvestorResponse>("/v1/investor", {
    method: "POST",
  });
};

export const useLoginInvestor = () => {
  return useHttpMutation<unknown, InvestorLoginResponse>(
    "/v1/investor/sign-in",
    {
      method: "POST",
      queryOptions: {
        onSuccess: (data) => {
          Cookies.set("accessToken", data.data.token);
          window.location.href = "/dashboard";
        },
      },
    }
  );
};
