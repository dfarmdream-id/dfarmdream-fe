import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import {
  GetIotDeviceResponse,
  GetListIotDeviceResponse,
} from "../_models/response/iot-device";
import { ChartDataResponse } from "../_models/response/sensor";

export const useGetIotDevices = (params: Record<string, string>) => {
  return useHttp<GetListIotDeviceResponse>("/v1/sensor", {
    params,
  });
};

export const useCreateIotDevice = () => {
  return useHttpMutation<GetIotDeviceResponse>("/v1/sensor", {
    method: "POST",
  });
};

export const useDeleteIotDevice = () => {
  return useHttpMutation<GetIotDeviceResponse>("/v1/sensor/{id}", {
    method: "DELETE",
  });
};

export const useUpdateIotDevice = () => {
  return useHttpMutation<GetIotDeviceResponse>("/v1/sensor/{id}", {
    method: "PUT",
  });
};

export const useGetIotDevice = (id: string) => {
  return useHttp<GetIotDeviceResponse>(useMemo(() => `/v1/sensor/${id}`, [id]));
};

export const useGetTemperatureData = (params: Record<string, string>)=>{
  return useHttp<ChartDataResponse>("/v1/sensor/temperature", {
    params,
  });
}

export const useGetAmoniaData = (params: Record<string, string>)=>{
  return useHttp<ChartDataResponse>("/v1/sensor/amonia", {
    params,
  });
}

export const useGetHumidityData = (params: Record<string, string>)=>{
  return useHttp<ChartDataResponse>("/v1/sensor/humidity", {
    params,
  });
}