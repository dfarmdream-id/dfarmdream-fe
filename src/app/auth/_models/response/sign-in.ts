import { Site } from "@/app/(authenticated)/_models/response/profile";

export interface SignInResponse {
  message: string;
  data: User;
  status: number;
}

export interface SignInChooseResponse {
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
  sites: { siteId: string; site: Site }[];
}
