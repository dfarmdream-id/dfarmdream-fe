import { useHttp, useHttpMutation } from "@/hooks/http";
import { GetPersediaanBarangResponse } from "../_models/response/persediaan-barang";
import { GetListTransaksiBarangResponse } from "../_models/response/transaksi-barang";

export const useGetListTransaksiBarang = (params: Record<string, string>) => {
  return useHttp<GetListTransaksiBarangResponse>("/v1/persediaan-barang/transaksi", {
    params,
  });
};

export const useCreateTransaksiBarang = () => {
  return useHttpMutation<GetPersediaanBarangResponse>("/v1/persediaan-barang/transaksi", {
    method: "POST",
  });
};
