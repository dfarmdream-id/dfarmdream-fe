export interface GetListCOAResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetCOAResponse {
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
    code:number;
    name:string;
    level:number;
    isBalanceSheet:boolean;
    isRetainedEarnings:boolean;
    createdAt:string;
    updatedAt:string;
    groupId:string;
    group:GroupCOA
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  
  export interface GroupCOA{
    id:string;
    name:string;
    code:string
  }