"use client";
import { Input, InputProps } from "@nextui-org/input";
import { forwardRef, useEffect, useMemo, useState } from "react";

type InputNumberProps = Omit<InputProps, "value" | "onChange"> & {
  value?: number;
  onChange?: (value: number) => void;
};

// eslint-disable-next-line react/display-name
export const InputNumber = forwardRef((props: InputNumberProps, ref: any) => {
  const [value, setValue] = useState<number>();

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const formattedValue = useMemo(() => {
    return Number(value || 0).toLocaleString("id-ID", {
      maximumFractionDigits: 0,
    });
  }, [value]);
  return (
    <Input
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Backspace") return;
        return /[^0-9]/i.test(e.key) && e.preventDefault();
      }}
      {...props}
      type="text"
      value={formattedValue}
      onChange={(e) => {
        setValue(Number(e.target.value.replace(/\D/g, "")) || 0);
        props.onChange?.(Number(e.target.value.replace(/\D/g, "")) || 0);
      }}
    />
  );
});
