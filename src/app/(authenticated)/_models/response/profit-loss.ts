export interface ProfitLossResponses {
  data: Data
  message: string
}

export interface Data {
  trialBalance: TrialBalance[]
  totalDebit: number
  totalCredit: number
  isBalanced: boolean
}

export interface TrialBalance {
  _sum: Sum
  coa: Coa
}

export interface Sum {
  debit: number
  credit: number
}

export interface Coa {
  code: number
  name: string
  level: number
  isBalanceSheet: boolean
  isRetainedEarnings: boolean
}
