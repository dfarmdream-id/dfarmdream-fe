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
  name:string;
  code: string;
  tempThreshold: number;
  humidityThreshold: number;
  amoniaThreshold: number;
  ldrThreshold: number;
  cageId?: string;
  cage?: Cage;
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

export interface GetListRelayObjectResponse {
  message: string;
  data: RelayObjectData;
  status: number;
}
export interface RelayObjectData {
  data: RelayLogObject[];
  meta: Meta;
}

export interface RelayLogObject {
  id:string;
  sensor: Daum;
  relayNumber: number;
  relayDesc: string;
  status: number;
  humidity: number;
  temperature: number;
  amonia: number;
  ldrValue: number;
  epoch: number;
  createdAt: string;
  updatedAt: string;
}
