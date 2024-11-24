export interface GetPositionListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetPositionResponse {
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
  name: string;
  checkinTime:string;
  checkoutTime:string;
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
