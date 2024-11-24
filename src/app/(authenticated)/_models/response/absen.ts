export interface AbsenListResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetAbsenResponse {
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
    userId: string;
    name:string;
    tanggal:string;
    jamMasuk:string;
    jamKeluar:string;
    status:number;
  }
  
 
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  