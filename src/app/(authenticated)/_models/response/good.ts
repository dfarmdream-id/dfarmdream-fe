
export interface GetListGoodResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetGoodResponse {
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