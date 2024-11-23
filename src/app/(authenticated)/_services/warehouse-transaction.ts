"use client";
import { useHttp, useHttpMutation } from "@/hooks/http";
import {
  GetWarehouseTransactionListResponse,
  GetWarehouseTransactionResponse,
} from "../master/_models/response/warehouse-transaction";
import { useMemo } from "react";

export const useGetWarehouseTransactions = (params: Record<string, string>) => {
  return useHttp<GetWarehouseTransactionListResponse>(
    "/v1/warehouse-transaction",
    {
      params,
    }
  );
};

export const useCreateWarehouseTransaction = () => {
  return useHttpMutation("/v1/warehouse-transaction", {
    method: "POST",
  });
};

export const useDeleteWarehouseTransaction = () => {
  return useHttpMutation("/v1/warehouse-transaction/{id}", {
    method: "DELETE",
  });
};

export const useUpdateWarehouseTransaction = () => {
  return useHttpMutation("/v1/warehouse-transaction/{id}", {
    method: "PUT",
  });
};

export const useGetWarehouseTransaction = (id: string) => {
  return useHttp<GetWarehouseTransactionResponse>(
    useMemo(() => `/v1/warehouse-transaction/${id}`, [id])
  );
};
