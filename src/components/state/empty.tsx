"use client";
import Empty from "@/assets/lottie/empty.json";
import Lootie from "lottie-react";

export default function EmptyState() {
  return (
    <div>
      <Lootie animationData={Empty} />
    </div>
  );
}
