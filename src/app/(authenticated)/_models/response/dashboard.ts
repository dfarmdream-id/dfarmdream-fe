export interface DashboardSummaryResponse {
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  user: number;
  cage: number;
  investor: number;
}

export interface DashboardChartResponse {
  message: string;
  data: Chart;
  status: number;
}

export interface Chart {
  alive: number;
  dead: number;
}
