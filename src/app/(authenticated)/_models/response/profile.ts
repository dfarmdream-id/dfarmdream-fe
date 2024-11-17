export interface ProfileResponse {
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  id: string;
  email: string;
  fullName: string;
  username: string;
  address: string;
  phone: string;
  sites: Site[];
  site: {
    name: string;
  };
  position: Position;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
}

export interface Site {
  id: string;
  userId: string;
  siteId: string;
  deletedAt: any;
  createdAt: string;
  site: {
    name: string;
  };
  updatedAt: string;
}

export interface Position {
  id: string;
  name: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  userId: string;
  roleId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
}
