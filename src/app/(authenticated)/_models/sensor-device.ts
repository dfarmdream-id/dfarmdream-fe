export interface GetListSensorDeviceResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetSensorDeviceResponse {
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
    type:string;
    lastestValue:number;
    lastUpdatedAt:number;
    deviceId: string;
    device:Device
    updatedAt:string;
  }

  export interface Device{
    id:string;
    code:string;
    name:string;
    cageId:string;
    cage:Cage
  }

  export interface Cage {
    id: string;
    name: string;
    site?: Site
  }
  
  export interface Site{
    id:string;
    name:string;
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  
  