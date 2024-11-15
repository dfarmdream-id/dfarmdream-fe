export interface UserResponse {
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
  email: string;
  username: string;
  fullName: string;
  password: string;
  identityId: string;
  phone: string;
  address: string;
  status: string;
  position: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
