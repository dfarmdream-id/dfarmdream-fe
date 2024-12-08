export interface GetListGroupCOAResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetGroupCOAResponse {
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
    code: number;
    name: string;
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
  