export interface Data {
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  userId: string;
  fullName: string;
  identityId: string;
  kandang: string;
  lokasi: string;
  createdAt: string;
  tanggal: string;
  sensor: Sensor;
  user: User;
}

export interface User {
  id: string;
  nip: string;
  email: string;
  username: string;
  fullName: string;
  identityId: string;
  phone: string;
  address: string;
  status: string;
  lastSendNotification: string;
  telegramId: string;
  telegramUsername: string;
}

export interface Sensor {
  id: string;
  name: string;
  code: string;
  cageId: string;
  tempThreshold: number;
  humidityThreshold: number;
  amoniaThreshold: number;
  currentTemperature: number;
  currentHumidty: number;
  currentAmonia: number;
  currentAirQuality: number;
  lampStatus: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  cage: Cage;
}

export interface Cage {
  id: string;
  name: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
  siteId: string;
  width: number;
  height: number;
  capacity: number;
  status: string;
  site: Site;
}

export interface Site {
  id: string;
  name:string;
  userId: string;
  siteId: string;
  deletedAt: any;
  createdAt: string;
  updatedAt: string;
}


export interface Meta {
  limit: number;
  page: number;
  totalData: number;
  totalPage: number;
}

export interface TelegramLogResponse {
  message: string;
  data: Data;
  status: number;
}
  