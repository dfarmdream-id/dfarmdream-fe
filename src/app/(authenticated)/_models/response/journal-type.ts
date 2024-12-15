export interface JournalTypeListResponse {
  message: string;
  data: Data;
  status: number;
}

export interface JournalTypeResponse {
  message: string;
  data: Daum;
  status: number;
}

export interface Data {
  data: Daum[];
  meta: Meta;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}

export interface Daum {
  id: string;
  name: string;
  code: number;
  status: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
  JournalTemplate?: JournalTemplate[]; // Menambahkan properti JournalTemplate
}

export interface JournalTemplate {
  id: string;
  name: string;
  journalTemplateDetails: JournalTemplateDetail[];
}

export interface JournalTemplateDetail {
  coaCode: number;
  typeLedger: "DEBIT" | "CREDIT";
  coa: Coa;
}

export interface Coa {
  code: number;
  name: string;
}