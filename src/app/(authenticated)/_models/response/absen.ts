export interface AbsenListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetAbsenResponse {
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
  userId: string;
  name: string;
  tanggal: string;
  jamMasuk: string;
  jamKeluar: string;
  timestampMasuk: string;
  timestampKeluar: string;
  total:number;
  user: User
  status: number;
}

export interface User {
  id: string;
  fullName: string;
  identityId:string;
  phone?: string;
  position?:Position
  sites: Site[]
}

export interface Position{
  id:string;
  name:string;
  checkKandang:boolean
}

export interface Site {
  id: string;
  userId: string;
  siteId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  site: Site2;
}

export interface Site2 {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  provinceId: any;
  cityId: any;
  districtId: any;
  subDistrictId: any;
  address: any;
}


export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}

export interface AbsenLogResponse {
  message: string;
  data: DataLog;
  status: number;
}

export interface DataLog {
  data: LogResponse[];
  meta: Meta;
}

export interface LogResponse {
  id:string;
  tanggal:string;
  checkInAt:string;
  site:Site2,
  cage:Cage,
  user:User
}

export interface Cage{
  id:string;
  name:string;
}
  