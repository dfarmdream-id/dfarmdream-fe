import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useMemo, useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {useGetBatchs} from "@/app/(authenticated)/_services/batch";

interface FilterBatchProps {
  onBatchIdChange: (batchId: string) => void; // Callback untuk mengirim batchId ke parent
  batchId?: string | null;
  label?: string;
  className?: string;
  disableLabel?: boolean;
}

export default function FilterBatch({ onBatchIdChange, batchId,label,className, disableLabel }: FilterBatchProps) {
  const schema = z.object({
    batchId: z.string({
      message: "Mohon pilih Batch",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });
  
  const [batchSearch, setBatchSearch] = useState("");
  const [debouncedBatchSearch, setDebouncedBatchSearch] = useState("");
  const [batchLimit, setBatchLimit] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBatchSearch(batchSearch);
    }, 300); // Delay 300ms
    return () => clearTimeout(handler); // Cleanup jika input berubah sebelum delay selesai
  }, [batchSearch]);

  // Data Batch
  const batchsData = useGetBatchs(
    useMemo(
      () => ({
        page: "1",
        limit: batchLimit.toString(),
        q: debouncedBatchSearch, // Menggunakan pencarian yang telah di-debounce
      }),
      [batchLimit, debouncedBatchSearch]
    )
  );

  const onBatchInputChange = (value: string) => {
    setBatchSearch(value); // Perbarui pencarian
    setBatchLimit(10); // Reset limit saat pencarian berubah
  };

  const onBatchSelectionChange = (selected: string) => {
    form.setValue("batchId", selected); // Perbarui nilai batchId
    onBatchIdChange(selected); // Kirim nilai batchId ke parent component
  };

  useEffect(() => {
    if (batchId) {
      form.setValue("batchId", batchId);
      onBatchIdChange(batchId);
    }
  }, [batchId]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

      {/* Batch Section */}
      <div className="space-y-2">
        <Autocomplete
          labelPlacement="outside"
          variant="bordered"
          // label={label || "Batch"}
          label={disableLabel ? "" : label || "Batch"} // Menyembunyikan label jika disableLabel bernilai true
          className={className}
          placeholder="Masukkan nama batch"
          isLoading={batchsData.isLoading}
          onInputChange={(value) => onBatchInputChange(value)} // Menggunakan debounce pada input
          onSelectionChange={(selected) => onBatchSelectionChange(selected as string)}
          aria-label="Autocomplete untuk memilih batch" // Menambahkan aria-label
          selectedKey={batchId as string} // Menambahkan defaultSelectedKey
        >
          {batchsData.data?.data?.data?.map((batch) => (
            <AutocompleteItem
              key={batch.id}
              value={batch.id}
              aria-label={`[${batch.status}]: ${batch.name}`} // Menambahkan aria-label pada item
            >
              <div className="flex gap-2 items-center">
                <div className="flex flex-col">
                  <span className="text-small">{batch.name}</span>
                  <span className="text-tiny text-default-400">{batch.status}</span>
                </div>
              </div>
            </AutocompleteItem>
          )) || []}
        </Autocomplete>
      </div>
    </div>
  );
}
