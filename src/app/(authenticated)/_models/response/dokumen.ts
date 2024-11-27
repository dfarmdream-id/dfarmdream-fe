export interface DokumenListResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface DokumenResponse {
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
    name: string;
    url: string;
    investorId:string;
    investor:InvestorData;
    deletedAt: any;  
    createdAt: string;
    updatedAt: string;
  }

  export interface InvestorData {
    id:string;
    fullName:string;
    username:string;
    identityId:string;
    address:string;
    phone:string;
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  
  
  export interface InvestorLoginResponse {
    message: string
    data: Data
    status: number
  }
  
  export interface Data {
    user: Investor
    token: string
  }
  
  export interface Investor {
    id: string
    fullName: string
    username: string
    password: string
    identityId: string
    address: string
    phone: string
    deletedAt: any
    createdById: any
    createdAt: string
    updatedAt: string
  }
  