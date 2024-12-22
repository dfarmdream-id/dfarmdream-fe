export interface ChickenListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface ChickenResponse {
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
  status: string;
  rackId?: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  rack?: Rack;
  disease?: Disease;
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string;
  treatment: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
}

export interface Rack {
  id: string;
  name: string;
  cageId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  cage: Cage;
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

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
