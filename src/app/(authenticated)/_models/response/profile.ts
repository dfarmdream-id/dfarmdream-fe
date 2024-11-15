export interface ProfileResponse {
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  id: string;
  email: string;
  fullName: string;
}
