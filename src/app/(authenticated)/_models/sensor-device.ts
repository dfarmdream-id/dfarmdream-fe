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
  
  export interface GetSensorLogResponse {
    message: string;
    data: DataLog;
    status: number
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

  export interface DataLog{
    data:ObjectLog[];
    meta:Meta;
  }
  
  export interface ObjectLog{
    id:string;
    type:string;
    averageValue:string;
    epoch:number;
    interval:string;
    sensor:Sensor;
  }

  export interface Sensor{
    id:string;
    code:string;
    type:string;
  }