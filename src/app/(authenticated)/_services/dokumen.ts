import { useHttp, useHttpMutation } from "@/hooks/http";
import { DokumenListResponse, DokumenResponse } from "../_models/response/dokumen";

export const useGetDokumen = (params: Record<string, string|null>) => {
  return useHttp<DokumenListResponse>("/v1/document-investment", {
    params,
  });
};

export const useUploadDokumen = () => {
  return useHttpMutation<DokumenResponse>("/v1/document-investment", {
    method: "POST",
  });
}

export const useDeleteDokumen = () => {
  return useHttpMutation("/v1/document-investment/{id}", {
    method: "DELETE",
  });
};


// export const useGetInvestor = (id: string) => {
//   return useHttp<InvestorResponse>(`/v1/investor/${id}`);
// };

// export const useDeleteInvestor = () => {
//   return useHttpMutation("/v1/investor/{id}", {
//     method: "DELETE",
//   });
// };


// };

// export const useCreateInvestor = () => {
//   return useHttpMutation<InvestorResponse>("/v1/investor", {
//     method: "POST",
//   });
// };

// export const useLoginInvestor = () => {
//   return useHttpMutation<unknown, InvestorLoginResponse>(
//     "/v1/investor/sign-in",
//     {
//       method: "POST",
//       queryOptions: {
//         onSuccess: (data) => {
//           Cookies.set("accessToken", data.data.token);
//           window.location.href = "/dashboard";
//         },
//       },
//     }
//   );
// };
