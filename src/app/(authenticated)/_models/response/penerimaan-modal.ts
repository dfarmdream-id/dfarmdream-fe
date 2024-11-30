
export interface GetListPenerimaanModalResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetPenerimaanModalResponse {
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
    tanggal:string;
    investorId:string;
    investor:Investor;
    nominal: number;
    siteId:string;
    site: Site;
    cageId:string;
    cage:Cage;
    status:number;
    createdAt: string;
    updatedAt?: string;
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

  export interface Investor {
    id: string;
    fullName: string;
    username: string;
    password: string;
    identityId: string;
    address: string;
    phone: string;
    deletedAt: any;
  
    createdById: any;
    createdAt: string;
    updatedAt: string;
  }