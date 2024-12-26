export interface BatchListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface GetBatchResponse {
  message: string;
  data: Daum;
  status: number;
}

export interface Data {
  data: Daum[];
  meta: Meta;
}

export enum BatchStatus {
  ONGOING= 'ONGOING',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
}

export interface Daum {
  id: string;
  name: string;
  startDate: string;
  endDate?: string | null;
  status: BatchStatus;
  siteId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
