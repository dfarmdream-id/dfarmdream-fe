import { useHttp, useHttpMutation } from "@/hooks/http";
import { useMemo } from "react";
import { GetListSensorDeviceResponse, GetSensorDeviceResponse } from "../_models/sensor-device";

export const useGetSensorDeviceList = (params: Record<string, string>) => {
  return useHttp<GetListSensorDeviceResponse>("/v1/sensor-device", {
    params,
  });
};

export const useCreateSensorDevice = () => {
  return useHttpMutation<GetSensorDeviceResponse>("/v1/sensor-device", {
    method: "POST",
  });
};

export const useDeleteSensorDevice = () => {
  return useHttpMutation<GetSensorDeviceResponse>("/v1/sensor-device/{id}", {
    method: "DELETE",
  });
};

export const useUpdateSensorDevice = () => {
  return useHttpMutation<GetSensorDeviceResponse>("/v1/sensor-device/{id}", {
    method: "PUT",
  });
};

export const useGetSensorDevice = (id: string) => {
  return useHttp<GetSensorDeviceResponse>(useMemo(() => `/v1/sensor-device/${id}`, [id]));
};