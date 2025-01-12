import {Batch} from "@/app/(authenticated)/_models/response/rack";

export interface GetListJournalResponse {
  message: string;
  data: ListJournalData;
  status: number;
}

export interface GetJournalResponse {
  message: string;
  data: SingleJournalData;
  status: number;
}

export interface ListJournalData {
  data: SingleJournalData[];
  meta: Meta;
}

export interface SingleJournalData {
  id: string;
  code: string;
  date: string; // ISO-8601 DateTime
  userId: string;
  jurnalTypeId: string;
  debtTotal: number;
  creditTotal: number;
  status: string;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  journalType: JurnalType;
  journalDetails: JournalDetail[];
  user: User;
  batch: Batch
}

export interface User {
  fullName: string
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

export interface JournalDetail {
  id: string;
  debit: number;
  credit: number;
  note: string;
  coa: Coa;
}

export interface Coa {
  code: string;
  name: string;
}

export interface GetJournalBalanceSheetResponse {
  message: string;
  data: JournalBalanceSheetData;
}

export interface JournalBalanceSheetData {
  trialBalance: TrialBalance[];
  totalDebit: number;
  totalCredit: number;
  isBalanced: boolean;
}

export interface TrialBalance {
  _sum: Sum;
  coa: Coa;
}

export interface Sum {
  debit: number;
  credit: number;
}
