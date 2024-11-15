export interface SignInResponse {
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  token: string;
  user: User;
}

export interface User {
  email: string;
  id: string;
  fullName: string;
}
