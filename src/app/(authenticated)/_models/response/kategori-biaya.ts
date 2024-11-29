export interface GetListKategoriBiayaResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetKategoriBiayaResponse {
    message: string;
    data: Daum;
    status: number;
  }
  
  export interface Data {
    data: Daum[];
    meta: Meta;
  }
  
  export interface Daum {
    id: string;
    namaKategori: string;
    kodeAkun: string;
    status: number;
    createdAt: string;
    updatedAt?: string;
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  