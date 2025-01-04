import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useMemo, useState, useEffect } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useGetListGood } from "../_services/good";

interface FilterBarangProps {
  onChangeIdBarang: (goodsId: string) => void; // Callback untuk mengirim cageId ke parent
}

export default function FilterBarang({ onChangeIdBarang }: FilterBarangProps) {
  const schema = z.object({
    goodsId: z.string({
      message: "Mohon pilih barang",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const [limit, setLimit] = useState(20);

  // Debounce input untuk pencarian kandang
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Data kandang
  const barangData = useGetListGood(
    useMemo(
      () => ({
        page: "1",
        limit: limit.toString(),
        q: debounceSearch,
      }),
      [limit, debounceSearch]
    )
  );

  // Handler perubahan input Autocomplete
  const onInputChange = (value: string) => {
    setSearch(value);
    setLimit(20); // Reset limit saat mencari data baru
  };

  // Handler perubahan seleksi Autocomplete
  const onChangeSelected = (selected: string) => {
    form.setValue("goodsId", selected);
    onChangeIdBarang(selected);
  };

  return (
    <div className="w-full md:w-[15rem]">
      <Autocomplete
        labelPlacement="outside"
        variant="bordered"
        placeholder="Masukkan nama barang"
        isLoading={barangData.isLoading}
        onInputChange={onInputChange}
        onSelectionChange={(selected) => onChangeSelected(selected as string)}
        aria-label="Autocomplete untuk memilih barang"
      >
        {barangData.data?.data?.data?.map((item) => (
          <AutocompleteItem
            key={item.id}
            value={item.id}
            aria-label={`Barang: ${item.name}`}
          >
            {item.name}
          </AutocompleteItem>
        )) || []}
      </Autocomplete>
    </div>
  );
}
