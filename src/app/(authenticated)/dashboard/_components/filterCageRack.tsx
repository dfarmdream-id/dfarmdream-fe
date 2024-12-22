import { z } from "zod";
import { useForm } from "@/hooks/form";
import { useMemo, useState, useEffect } from "react";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
// import { useGetCageRacks } from "@/app/(authenticated)/_services/rack";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface FilterCageRackProps {
  // onRackIdChange: (rackId: string) => void; // Callback untuk mengirim rackId ke parent
  onCageIdChange: (cageId: string) => void; // Callback untuk mengirim cageId ke parent
}

export default function FilterCageRack({ 
                                         // onRackIdChange, 
                                         onCageIdChange }: FilterCageRackProps) {
  const schema = z.object({
    cageId: z.string({
      message: "Mohon pilih Kandang",
    }),
    rackId: z.string({
      message: "Mohon pilih Rak",
    }),
  });

  const form = useForm<z.infer<typeof schema>>({
    schema,
  });

  // const watch = form.watch();

  // States untuk pencarian dan limit
  const [cageSearch, setCageSearch] = useState("");
  const [debouncedCageSearch, setDebouncedCageSearch] = useState("");
  const [cageLimit, setCageLimit] = useState(10);

  // const [rackSearch, setRackSearch] = useState("");
  // const [debouncedRackSearch, setDebouncedRackSearch] = useState("");
  // const [rackLimit, setRackLimit] = useState(10);

  // Debounce input untuk cageSearch
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCageSearch(cageSearch);
    }, 300); // Delay 300ms
    return () => clearTimeout(handler); // Cleanup jika input berubah sebelum delay selesai
  }, [cageSearch]);

  // Debounce input untuk rackSearch
  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     setDebouncedRackSearch(rackSearch);
  //   }, 300); // Delay 300ms
  //   return () => clearTimeout(handler); // Cleanup jika input berubah sebelum delay selesai
  // }, [rackSearch]);

  // Data Kandang
  const cagesData = useGetCages(
    useMemo(
      () => ({
        page: "1",
        limit: cageLimit.toString(),
        q: debouncedCageSearch, // Menggunakan pencarian yang telah di-debounce
      }),
      [cageLimit, debouncedCageSearch]
    )
  );

  // Data Rak
  // const racksData = useGetCageRacks(
  //   useMemo(
  //     () => ({
  //       page: "1",
  //       limit: rackLimit.toString(),
  //       cageId: watch.cageId,
  //       q: debouncedRackSearch, // Menggunakan pencarian yang telah di-debounce
  //     }),
  //     [rackLimit, debouncedRackSearch, watch.cageId]
  //   )
  // );

  // Fungsi untuk menangani perubahan input pada Autocomplete
  const onCageInputChange = (value: string) => {
    setCageSearch(value); // Perbarui pencarian
    setCageLimit(10); // Reset limit saat pencarian berubah
  };

  // const onRackInputChange = (value: string) => {
  //   setRackSearch(value); // Perbarui pencarian
  //   setRackLimit(10); // Reset limit saat pencarian berubah
  // };

  // Fungsi untuk menangani perubahan seleksi
  const onCageSelectionChange = (selected: string) => {
    form.setValue("cageId", selected); // Perbarui nilai cageId
    onCageIdChange(selected); // Kirim nilai cageId ke parent component
  };

  // const onRackSelectionChange = (selected: string) => {
  //   form.setValue("rackId", selected); // Perbarui nilai rackId
  //   onRackIdChange(selected); // Kirim nilai rackId ke parent component
  // };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
      {/* Kandang Section */}
      <div className="space-y-2">
        <Autocomplete
          labelPlacement="outside"
          variant="bordered"
          placeholder="Masukkan nama kandang"
          isLoading={cagesData.isLoading}
          onInputChange={(value) => onCageInputChange(value)} // Menggunakan debounce pada input
          onSelectionChange={(selected) => onCageSelectionChange(selected as string)}
          aria-label="Autocomplete untuk memilih kandang" // Menambahkan aria-label
        >
          {cagesData.data?.data?.data?.map((cage) => (
            <AutocompleteItem
              key={cage.id}
              value={cage.id}
              aria-label={`Kandang: ${cage.name}`} // Menambahkan aria-label pada item
            >
              {cage.name}
            </AutocompleteItem>
          )) || []}
        </Autocomplete>
      </div>

      {/* Rak Section */}
      {/*<div className="space-y-2">*/}
      {/*  <Autocomplete*/}
      {/*    labelPlacement="outside"*/}
      {/*    variant="bordered"*/}
      {/*    placeholder="Masukkan nama rak"*/}
      {/*    isLoading={racksData.isLoading}*/}
      {/*    disabled={!watch.cageId} // Disable jika kandang belum dipilih*/}
      {/*    onInputChange={(value) => onRackInputChange(value)} // Menggunakan debounce pada input*/}
      {/*    onSelectionChange={(selected) => onRackSelectionChange(selected as string)}*/}
      {/*    aria-label="Autocomplete untuk memilih rak" // Menambahkan aria-label*/}
      {/*  >*/}
      {/*    {racksData.data?.data?.data?.map((rack) => (*/}
      {/*      <AutocompleteItem*/}
      {/*        key={rack.id}*/}
      {/*        value={rack.id}*/}
      {/*        aria-label={`Rak: ${rack.name}`} // Menambahkan aria-label pada item*/}
      {/*      >*/}
      {/*        {rack.name}*/}
      {/*      </AutocompleteItem>*/}
      {/*    )) || []}*/}
      {/*  </Autocomplete>*/}
      {/*</div>*/}
    </div>
  );
}
