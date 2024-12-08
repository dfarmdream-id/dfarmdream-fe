export interface ChartDataResponse {
    message: string
    data: Data
    status: number
  }

  export interface Chart{
    x:string
    y:number
  }

  export interface Sensor {
    id:string
    code:string
    type:number
    lastestValue:number
    IotSensor:IotSensor
  }
  
  export interface IotSensor{
    id:string;
    name:string;
    code:string;
    cageId:string;
    tempThreshold:number;
    humidityThreshold:number;
    amoniaThreshold:number;
    lampStatus:number
  }
  export interface Data {
    chart: Chart[]
    sensors: Sensor[]
  }
  