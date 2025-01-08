// SkeletonPagination.jsx (atau langsung di file yang sama)

import { Skeleton } from "@nextui-org/react";

export default function SkeletonPagination() {
  // Misalnya kita buat 5 “titik” skeleton untuk melambangkan 5 page
  return (
    <div className="flex items-center gap-2 mt-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton
          // pastikan Anda sudah install @nextui-org/react v2
          key={i}
          className="rounded-xl"
          // sesuaikan style sesuai kebutuhan
          style={{ width: 35, height: 35 }}
        />
      ))}
    </div>
  );
}
