export interface GetListTemplateJournalResponse {
  message: string;
  data: ListTemplateJournalData;
  status: number;
}

export interface GetTemplateJournalResponse {
  message: string;
  data: SingleTemplateJournalData;
  status: number;
}

export interface ListTemplateJournalData {
  data: SingleTemplateJournalData[];
  meta: Meta;
}

export interface SingleTemplateJournalData {
  id: string;
  code: string;
  name: string;
  jurnalTypeId: string;
  status: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  jurnalType: JurnalType;
  journalTemplateDetails: JournalTemplateDetail[];
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}

export interface JurnalType {
  id: string;
  name: string;
}

export interface JournalTemplateDetail {
  id: string;
  typeLedger: string;
  status: string;
  coa: Coa;
}

export interface Coa {
  code: number;
  name: string;
}
