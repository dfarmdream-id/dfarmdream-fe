export interface GetListBiayaResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetBiayaResponse {
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
    kategoriId:string;
    kategoriBiaya:KategoriBiaya;
    tanggal: string;
    siteId:string;
    biaya:number;
    site: Site;
    cageId:string;
    cage:Cage;
    userId:string;
    user:User;
    keterangan:string;
    status:number;
    qtyOut: number;
    createdAt: string;
    updatedAt?: string;
    persediaanPakanObat: PersediaanPakanObat
  }
  
  export interface PersediaanPakanObat {
    id: string;
    goodsId: string;
    qty: number;
    harga: number;
    total: number;
    siteId: string;
    cageId: string;
    status: number;
    goods: Good;
  }
  
  export interface Good {
    id: string;
    sku: string;
    name: string;
    type: string;
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

  export interface User{
    id: string;
    email: string;
    username: string;
    fullName: string;
    password: string;
    identityId: any;
    phone?: string;
    address?: string;
    status: string;
    deletedAt: any;
    createdAt: string;
    updatedAt: string;
    positionId?: string;
  }

  export interface Site{
    id: string;
    name: string;
  }

  export interface Cage{
    id: string;
    name: string;
  }