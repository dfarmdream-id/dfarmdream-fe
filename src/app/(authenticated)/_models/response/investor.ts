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

export interface Role {
  id: string
  investorId: string
  roleId: string
  deletedAt: any
  createdAt: string
  updatedAt: string
  role: Role2
}

export interface Role2 {
  id: string
  name: string
  deletedAt: any
  createdAt: string
  updatedAt: string
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
  roles: Role[];
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


export interface InvestorLoginResponse {
  message: string
  data: Data
  status: number
}

export interface Data {
  user: Investor
  token: string
}

export interface Investor {
  id: string
  fullName: string
  username: string
  password: string
  identityId: string
  address: string
  phone: string
  deletedAt: any
  createdById: any
  createdAt: string
  updatedAt: string
}
