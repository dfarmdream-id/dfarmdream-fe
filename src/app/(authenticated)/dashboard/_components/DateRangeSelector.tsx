"use client";

import React from "react";
import { DateRangePicker } from "@nextui-org/react";
import {getLocalTimeZone, today} from "@internationalized/date";

interface DateRangeSelectorProps {
  onChange?: (value: { startDate: Date; endDate: Date }) => void;
}

export function DateRangeSelector({
                                    onChange,
                                  }: DateRangeSelectorProps) {
  const handleDateChange = (range: { startDate: Date; endDate: Date }) => {
    if (onChange) {
      onChange(range);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <DateRangePicker
        labelPlacement="outside"
        variant="bordered"
        showMonthAndYearPickers={true}
        maxValue={today(getLocalTimeZone())}
        onChange={(value) => {
          handleDateChange({
            startDate: value.start ? new Date(value.start.toString()) : new Date(),
            endDate: value.end ? new Date(value.end.toString()) : new Date(),
          });
        }}
      />
    </div>
  );
}
