export interface DocumentInvestmentListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface DocumentInvestmentResponse {
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
  investorId: string;
  siteId: string;
  cageId: string;
  amount: number;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  fileId: string;
  cage: Cage;
  file: File;
  investor: Investor;
  site: Site;
}

export interface Cage {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  siteId: string;
  width: number;
  height: number;
  capacity: number;
  status: string;
}

export interface File {
  id: string;
  name: string;
  size: number;
  url: string;
  public: boolean;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  mime: string;
  provider: string;
}

export interface Investor {
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

export interface Site {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  provinceId: any;
  cityId: any;
  districtId: any;
  subDistrictId: any;
  address: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
