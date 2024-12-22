"use client"

import React from "react"
import { Tabs, Tab } from "@nextui-org/react"

interface TimePeriodSelectorProps {
  defaultValue?: string
  onChange?: (value: string) => void
}

export function TimePeriodSelector({ defaultValue = "days", onChange }: TimePeriodSelectorProps) {
  const handleSelectionChange = (key: React.Key) => {
    if (onChange && typeof key === "string") {
      onChange(key)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Tabs
        aria-label="Time period options"
        selectedKey={defaultValue}
        onSelectionChange={handleSelectionChange}
        color="success"
        variant="solid"
        classNames={{
          base: "bg-slate-100 p-1 rounded-lg",
          tabList: "gap-2",
          tab: "px-4 h-8 data-[selected=true]:bg-success data-[selected=true]:text-white rounded-md",
          tabContent: "group-data-[selected=true]:text-white",
          cursor: "bg-success",
        }}
      >
        <Tab key="days" title="Hari" />
        <Tab key="weeks" title="Minggu" />
        <Tab key="months" title="Bulan" />
        <Tab key="years" title="Tahun" />
      </Tabs>
    </div>
  )
}

