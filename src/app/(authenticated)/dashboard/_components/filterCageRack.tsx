import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useMemo, useState, useEffect } from "react";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface FilterCageRackProps {
  onCageIdChange: (cageId: string) => void; // Callback untuk mengirim cageId ke parent
}

export default function FilterCageRack({ onCageIdChange }: FilterCageRackProps) {
  const schema = z.object({
    cageId: z.string({
      message: "Mohon pilih Kandang",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const [cageSearch, setCageSearch] = useState("");
  const [debouncedCageSearch, setDebouncedCageSearch] = useState("");
  const [cageLimit, setCageLimit] = useState(10);

  // Debounce input untuk pencarian kandang
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCageSearch(cageSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [cageSearch]);

  // Data kandang
  const cagesData = useGetCages(
    useMemo(
      () => ({
        page: "1",
        limit: cageLimit.toString(),
        q: debouncedCageSearch,
      }),
      [cageLimit, debouncedCageSearch]
    )
  );

  // Handler perubahan input Autocomplete
  const onCageInputChange = (value: string) => {
    setCageSearch(value);
    setCageLimit(10); // Reset limit saat mencari data baru
  };

  // Handler perubahan seleksi Autocomplete
  const onCageSelectionChange = (selected: string) => {
    form.setValue("cageId", selected);
    onCageIdChange(selected);
  };

  return (
    <div className="w-full md:w-[20rem]">
      <Autocomplete
        labelPlacement="outside"
        variant="bordered"
        placeholder="Masukkan nama kandang"
        isLoading={cagesData.isLoading}
        onInputChange={onCageInputChange}
        onSelectionChange={(selected) => onCageSelectionChange(selected as string)}
        aria-label="Autocomplete untuk memilih kandang"
      >
        {cagesData.data?.data?.data?.map((cage) => (
          <AutocompleteItem
            key={cage.id}
            value={cage.id}
            aria-label={`Kandang: ${cage.name}`}
          >
            {cage.name}
          </AutocompleteItem>
        )) || []}
      </Autocomplete>
    </div>
  );
}
