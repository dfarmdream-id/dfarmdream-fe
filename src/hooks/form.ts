import { zodResolver } from "@hookform/resolvers/zod";
import { useForm as useReactHookForm, UseFormProps } from "react-hook-form";
import { Schema } from "zod";

type Opt<T extends object> = UseFormProps<T> & {
  schema: Schema;
};

export const useForm = <T extends object>(options: Opt<T>) => {
  return useReactHookForm<T>({
    mode: "all",
    resolver: zodResolver(options.schema),
    ...options,
  });
};
