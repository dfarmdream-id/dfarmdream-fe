export interface GetListIotDeviceResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetIotDeviceResponse {
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
    code:string;
    tempThreshold:number;
    humidityThreshold:number;
    amoniaThreshold:number;
    cageId?:string;
    cage?: Cage;
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
  