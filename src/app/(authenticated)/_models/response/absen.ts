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
  user: User
  status: number;
}

export interface User {
  id: string;
  name: string;
  phone?: string;
  sites: Site[]
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
  userId: string;
  fullName: string;
  identityId: string;
  kandang: string;
  lokasi: string;
  checkinat: string;
  tanggal: string;
}
  