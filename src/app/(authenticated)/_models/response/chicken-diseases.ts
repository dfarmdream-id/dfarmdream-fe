export interface ChickenDiseaseListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface ChickenDiseaseResponse {
  message: string;
  data: ChickenDisease;
  status: number;
}

export interface Data {
  data: ChickenDisease[];
  meta: Meta;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}

export interface ChickenDisease {
  id: string;
  name: string;
  description?: string;
  symptoms?: string;
  treatment?: string;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
