export interface GetListCCTVResponse {
    message: string;
    data: Data;
    status: number;
  }

  export interface GetAllCCTVDataResponse {
    message: string;
    data: Daum[];
    status: number;
  }
  
  export interface GetCCTVResponse {
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
    name:string;
    ipAddress:string;
    description:string;
    cageId?:string;
    cage?: Cage;
    createdAt?:Date;
  }
  
  export interface Cage {
    id: string;
    name: string;
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  