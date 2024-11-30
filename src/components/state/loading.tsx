import { Spinner } from "@nextui-org/react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Spinner />
      <div className="text-slate-600">Loading...</div>
    </div>
  );
}
