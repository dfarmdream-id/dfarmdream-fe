export interface InvestorListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface InvestorResponse {
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
  fullName: string;
  username: string;
  password: string;
  identityId: string;
  address: string;
  phone: string;
  deletedAt: any;
  createdById: any;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
