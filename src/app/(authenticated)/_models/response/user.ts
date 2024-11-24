export interface UserListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface UserResponse {
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
  email: string;
  username: string;
  fullName: string;
  password: string;
  identityId: any;
  phone?: string;
  address?: string;
  status: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  positionId?: string;
  sites: Site[];
  cages: Cage[];
  position?: Position;
  roles: Roles[];
}

export interface Roles {
  id: string;
  roleId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
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


export interface Cage {
  id: string;
  userId: string;
  cageId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  cage: Cage2;
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


export interface Cage2 {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
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
