export interface GetListJournalTypeResponse {
  message: string;
  data: ListJournalTypeData;
  status: number;
}

export interface GetJournalTypeResponse {
  message: string;
  data: SingleJournalTypeData;
  status: number;
}

export interface ListJournalTypeData {
  data: SingleJournalTypeData[];
  meta: Meta;
}

export interface SingleJournalTypeData {
  id: string;
  name: string;
}

export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}
