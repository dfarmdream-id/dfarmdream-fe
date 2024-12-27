import { useHttp, } from "@/hooks/http";
import {TelegramLogResponse} from "@/app/(authenticated)/_models/response/telegram-log";

export const useGetTelegramLog = (params: Record<string, string>) => {
  return useHttp<TelegramLogResponse>("/v1/telegram-log", {
    params,
  });
};
