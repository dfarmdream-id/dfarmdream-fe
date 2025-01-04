export interface DashboardSummaryResponse {
  message: string;
  data: Data;
  status: number;
}

export interface Data {
  user: number;
  cage: number;
  investor: number;
  qtyTotal: number;
  weightTotal: number;
}

export interface DashboardChartResponse {
  message: string;
  data: Chart;
  status: number;
}

export interface DashboardEggChartResponse {
  message: string;
  data: EggChart[];
  status: number;
}

export interface DashboardKeuanganResponse {
  data: DataKeuangan
}

interface DataKeuangan {
  chart: ChartKeuangan[];
  totalAsset: number;
  totalEquitas: number;
  totalNetProfit: number;
}

interface ChartKeuangan {
  month: number;
  totalAsset: number;
  totalEquitas: number;
  netProfit: number;
}

export interface DashboardChartDiseaseResponse {
  message: string;
  data: DiseaseChart[];
  status: number;
}

export interface DiseaseChart {
  disease: string;
  total: number;
}

export interface EggChart {
  date: string;
  total: number;
  totalBiaya: number;
  totalHarga: number;
}

export interface Chart {
  alive: number;
  dead: number;
  dead_due_to_illness: number;
  alive_in_sick: number;
  productive: number;
  feed_change: number
  spent: number;
  rejuvenation: number;
}


export interface LdrListDataResonse{
  message:string;
  data:LdrObject[],
  status:number
}


export interface LdrObject{
  id:string;
  code:string;
  lastestValue:number;
  type:string;
  IotSensor:IotSensor
}

export interface IotSensor{
  id:string;
  name:string;
  code:string;
  cageId:string;
  ldrThreshold:number;
  humidityThreshold:number;
  temperatureThreshold:number;
  amoniaThreshold:number;
}