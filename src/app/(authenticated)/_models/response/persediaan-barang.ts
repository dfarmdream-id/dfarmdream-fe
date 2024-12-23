
export interface GetListPersediaanBarangResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetPersediaanBarangResponse {
    message: string;
    data: Daum;
    status: number;
  }
  
  export interface Data {
    data: Daum[];
    meta: Meta;
  }
  
  export interface Daum {
    id:string;
    namaBarang:string;
    qty:number;
    harga:number;
    total:number;
    siteId:string;
    cageId:string;
    status:number;
    tipeBarang:string;
    site:Site;
    cage:Cage;
    goods:Good;
  }
  
  export interface Good {
    id:string;
    sku:string;
    name:string;
    type:string;
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  
  export interface KategoriBiaya{
    id: string;
    namaKategori:string
    kodeAkun:string;
  }

  export interface Site{
    id: string;
    name: string;
  }

  export interface Cage{
    id: string;
    name: string;
  }