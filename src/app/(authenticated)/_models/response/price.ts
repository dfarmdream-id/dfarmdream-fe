import { Site } from "./cage";

export interface GetPriceListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetPriceResponse {
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
  type: string;
  status: string;
  value: number;
  siteId: string;
  site: Site;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}

export interface User{
  id:string;
  nip:string;
  username:string;
}
export interface PriceLogObject{
  id:string;
  type: string;
  price: number;
  siteId: string;
  site: Site;
  userId:string;
  user:User
  createdAt: string;
  updatedAt: string;
}


export interface PriceLogData {
  data: PriceLogObject[];
  meta: Meta;
}

export interface GetPriceLogResponse {
  message: string;
  data: PriceLogData;
  status: number;
}