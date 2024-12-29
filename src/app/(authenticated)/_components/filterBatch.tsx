import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useMemo, useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useGetBatchs } from "@/app/(authenticated)/_services/batch";

interface FilterBatchProps {
  onBatchIdChange: (batchId: string) => void; // Callback untuk mengirim batchId ke parent
  batchId?: string | null;
  label?: string;
  className?: string;
  disableLabel?: boolean; // Menyembunyikan label jika diaktifkan
}

export default function FilterBatch({
                                      onBatchIdChange,
                                      batchId,
                                      label,
                                      className,
                                      disableLabel,
                                    }: FilterBatchProps) {
  // Validasi form
  const schema = z.object({
    batchId: z.string({ message: "Mohon pilih Batch" }),
  });

  // Inisialisasi useForm
  const form = useForm<z.infer<typeof schema>>({ schema });

  // State untuk pencarian batch
  const [batchSearch, setBatchSearch] = useState("");
  const [debouncedBatchSearch, setDebouncedBatchSearch] = useState("");
  const [batchLimit, setBatchLimit] = useState(10);

  // Debounce pencarian batch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBatchSearch(batchSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [batchSearch]);

  // Ambil data batch
  const batchsData = useGetBatchs(
    useMemo(
      () => ({
        page: "1",
        limit: batchLimit.toString(),
        q: debouncedBatchSearch,
      }),
      [batchLimit, debouncedBatchSearch]
    )
  );

  // Event handler untuk input Autocomplete
  const onBatchInputChange = (value: string) => {
    setBatchSearch(value);
    setBatchLimit(10);
  };

  // Event handler untuk seleksi item
  const onBatchSelectionChange = (selected: string) => {
    form.setValue("batchId", selected);
    onBatchIdChange(selected);
  };

  // Jika komponen menerima batchId dari luar, sinkronkan dengan form
  useEffect(() => {
    if (batchId) {
      form.setValue("batchId", batchId);
      onBatchIdChange(batchId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [batchId]);

  return (
    <div className="w-full md:w-[20rem]">
      <Autocomplete
        labelPlacement="outside"
        variant="bordered"
        label={disableLabel ? "" : label || "Batch"} // Mengatur label sesuai prop
        className={className}
        placeholder="Masukkan nama batch"
        isLoading={batchsData.isLoading}
        onInputChange={onBatchInputChange}
        onSelectionChange={(selected) => onBatchSelectionChange(selected as string)}
        aria-label="Autocomplete untuk memilih batch"
        selectedKey={batchId as string}
      >
        {(batchsData.data?.data?.data || []).map((batch) => (
          <AutocompleteItem
            key={batch.id}
            value={batch.id}
            aria-label={`[${batch.status}]: ${batch.name}`}
          >
            <div className="flex gap-2 items-center">
              <div className="flex flex-col">
                <span className="text-small">{batch.name}</span>
                <span className="text-tiny text-default-400">
                  {batch.status}
                </span>
              </div>
            </div>
          </AutocompleteItem>
        ))}
      </Autocomplete>
    </div>
  );
}
