import type { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import {
  type UseQueryOptions,
  type UseMutationOptions,
  useQuery,
  useMutation,
  UndefinedInitialDataOptions,
} from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import React from "react";
import { Button } from "@nextui-org/react";
import {signOut} from "@/app/(authenticated)/sign-out/_actions/sign-out";

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

http.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    // Jika respons berhasil, kembalikan langsung
    return response;
  },
  async (error) => {
    // Periksa jika status respons adalah 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Redirect ke halaman login (uncomment jika diperlukan)
      // window.location.href = "/auth/login";
      
      // Hapus token dari cookie
      await signOut();
    }

    // Tampilkan toast error dengan opsi refresh
    toast.error("Gagal memuat data, silahkan coba lagi", {
      action: React.createElement(
        Button,
        {
          variant: "light",
          color: "danger",
          onClick: () => {
            window.location.reload(); // Muat ulang halaman
          },
        },
        "Refresh" // Label tombol
      ),
    });

    // Tolak promise dengan error agar bisa ditangani di tempat lain
    return Promise.reject(error);
  }
);

type Config<TData = any, TError = DefaultError> = {
  method?: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "PATCH";
  keys?: any[];
  params?: Record<string, any>;
  httpOptions?: AxiosRequestConfig;
  queryOptions?: UseQueryOptions<TData, TError>;
};

type DefaultError = {
  message: string;
  validation: object;
};

/**
* API GET Method request only.
* @example
    const { data: items, isLoading, isError } = useHttp<number, string>('/', {
      keys: ['id']
      queryOptions: {
        onSuccess: function (data) {
          return
        },
        onError: function (data) {
          data
        },
      },
    })
* @param url URL API
* @param options HTTP Mutation Options
*/
export function useHttp<TData = any, TError = any>(
  url: string,
  options?: Config<TData, TError>
) {
  const defaultOptions: UndefinedInitialDataOptions<TData, TError> = {
    queryKey: [url, options],
    queryFn: async () => {
      try {
        const defaultConfig = {
          url,
        };

        if (options?.httpOptions) {
          Object.assign(defaultConfig, options.httpOptions);
        }

        if (options?.method) {
          Object.assign(defaultConfig, { method: options.method });
        } else {
          Object.assign(defaultConfig, { method: "GET" });
        }

        if (options?.params) {
          Object.assign(defaultConfig, { params: options.params });
        }
        const { data } = await http.request<TData>(defaultConfig);
        return data ?? null;
      } catch (e: any) {
        Promise.reject(e?.response ?? e);
        return e;
      }
    },
  };

  if (options?.queryOptions) {
    Object.assign(defaultOptions, options.queryOptions);
  }
  return useQuery(defaultOptions);
}

type HttpMutationOptions<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
  TContext = unknown
> = {
  method: "GET" | "HEAD" | "POST" | "OPTIONS" | "PUT" | "DELETE" | "PATCH";
  httpOptions?: AxiosRequestConfig;
  queryOptions?: UseMutationOptions<TData, TError, TVariables, TContext>;
};

function replaceDynamicParams(
  urlTemplate: string,
  params: Record<string, string | any>
) {
  return urlTemplate.replace(/{(\w+)}/g, (_, key) => {
    if (params[key] !== undefined) {
      return params[key];
    }
    throw new Error(`Missing parameter: ${key}`);
  });
}

/**
   * Update data to the server.
   * @example
    const {mutate, isFetching, isError, error} =  useHttpMutation<TData, TError>('todos/:id', {
      method: 'POST',
      httpOptions: { // axios options
        timeout: 30000,
      },
      queryOptions: { // vue-query options
        onSuccess: function (data) {
          console.log(data);
        },
        onError: function (data) {
          console.log(data);
        },
      },
      })
      const onSubmitForm = (data) => {
        mutate(data)
      }
   * @param url URL API
   * @param options HTTP Mutation Options
   */
export function useHttpMutation<
  TVariables = unknown,
  TData = unknown,
  TError = AxiosResponse<DefaultError>
>(url: string, options: HttpMutationOptions<TData, TError>) {
  return useMutation<
    TData,
    TError,
    {
      body?: FormData | any;
      headers?: Record<string, string>;
      params?: Record<string, string>;
      pathVars?: Record<string, string>;
    }
  >({
    mutationFn: (value) => {
      return new Promise<TData>((resolve, reject) => {
        const cfg = {
          url: replaceDynamicParams(url, value.pathVars ?? {}),
          method: options.method,
          ...options.httpOptions,
        };

        const val = value as {
          headers?: Record<string, string>;
          params?: Record<string, string>;
          body?: FormData | TVariables;
        };

        if (val.headers) {
          Object.assign(cfg, { headers: val.headers });
        }

        if (val.params) {
          Object.assign(cfg, { params: val.params });
        }

        if (val.body) {
          Object.assign(cfg, { data: val.body });
        }

        return http
          .request<TData>(cfg)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error: AxiosError<TError>) => {
            reject(error.response ?? error.message);
          });
      });
    },
    ...options.queryOptions,
  });
}
