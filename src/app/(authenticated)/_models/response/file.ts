export interface UploadFileResponse {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  size: number;
  name: string;
  url: string;
  public: boolean;
  mime: string;
}
