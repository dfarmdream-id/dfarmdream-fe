import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useMemo, useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import {useGetCageRacks} from "@/app/(authenticated)/_services/rack";

interface FilterRackProps {
  onRackIdChange: (rackId: string) => void; // Callback untuk mengirim rackId ke parent
}

export default function FilterRack({ onRackIdChange }: FilterRackProps) {
  const schema = z.object({
    rackId: z.string({
      message: "Mohon pilih Rak",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });
  
  const [rackSearch, setRackSearch] = useState("");
  const [debouncedRackSearch, setDebouncedRackSearch] = useState("");
  const [rackLimit, setRackLimit] = useState(10);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRackSearch(rackSearch);
    }, 300); // Delay 300ms
    return () => clearTimeout(handler); // Cleanup jika input berubah sebelum delay selesai
  }, [rackSearch]);

  // Data Rak
  const racksData = useGetCageRacks(
    useMemo(
      () => ({
        page: "1",
        limit: rackLimit.toString(),
        q: debouncedRackSearch, // Menggunakan pencarian yang telah di-debounce
      }),
      [rackLimit, debouncedRackSearch]
    )
  );

  const onRackInputChange = (value: string) => {
    setRackSearch(value); // Perbarui pencarian
    setRackLimit(10); // Reset limit saat pencarian berubah
  };

  const onRackSelectionChange = (selected: string) => {
    form.setValue("rackId", selected); // Perbarui nilai rackId
    onRackIdChange(selected); // Kirim nilai rackId ke parent component
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">

      {/* Rak Section */}
      <div className="space-y-2">
        <Autocomplete
          labelPlacement="outside"
          variant="bordered"
          label="Rak"
          placeholder="Masukkan nama rak"
          isLoading={racksData.isLoading}
          onInputChange={(value) => onRackInputChange(value)} // Menggunakan debounce pada input
          onSelectionChange={(selected) => onRackSelectionChange(selected as string)}
          aria-label="Autocomplete untuk memilih rak" // Menambahkan aria-label
        >
          {racksData.data?.data?.data?.map((rack) => (
            <AutocompleteItem
              key={rack.id}
              value={rack.id}
              aria-label={`Rak: ${rack.name}`} // Menambahkan aria-label pada item
            >
              {rack.name}
            </AutocompleteItem>
          )) || []}
        </Autocomplete>
      </div>
    </div>
  );
}
