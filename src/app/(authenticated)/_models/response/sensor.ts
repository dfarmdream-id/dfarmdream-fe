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
    code:string
    tempThreshold:number
    humidityThreshold:number
    amoniaThreshold:number
    currentTemperature:number
    currentHumidty:number
    currentAmonia:number
    lampStatus:any
  }
  
  export interface Data {
    chart: Chart[]
    sensors: Sensor[]
  }
  