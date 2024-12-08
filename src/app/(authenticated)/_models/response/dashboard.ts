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

export interface Chart {
  alive: number;
  dead: number;
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
}