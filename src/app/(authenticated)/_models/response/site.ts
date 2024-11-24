export interface GetSiteResponse {
  message: string;
  data: Daum;
  status: number;
}

export interface GetSiteListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  id: string;
  name: string;
  address: string;
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
