import React, { useState, useEffect, useRef } from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react"; // Optional, untuk loading indicator

interface FetchDataProps {
  page: number;
  search: string;
}

interface AutocompleteWithSearchProps {
  fetchData: (params: FetchDataProps) => Promise<{ data: Array<{ id: string; name: string }>; hasMore: boolean }>;
  label: string;
  placeholder: string;
}

export default function AutocompleteWithSearch({ fetchData, label, placeholder }: AutocompleteWithSearchProps) {
  const [data, setData] = useState<{ id: string; name: string }[]>([]); // State untuk menampung data
  const [inputValue, setInputValue] = useState<string>(""); // State untuk input pencarian
  const [page, setPage] = useState<number>(1); // State untuk pagination
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [hasMore, setHasMore] = useState<boolean>(true); // State untuk mengecek apakah ada data lagi

  const observer = useRef<IntersectionObserver | null>(null); // Ref untuk infinite scroll

  useEffect(() => {
    setPage(1); // Reset pagination jika input berubah
    setData([]); // Reset data ketika input berubah
    setHasMore(true);
    loadData(1, inputValue);
  }, [inputValue]);

  // Fungsi untuk memuat data dari server
  const loadData = async (page: number, search: string) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const result = await fetchData({ page, search });
      setData((prevData) => [...prevData, ...result.data]); // Append data baru
      setHasMore(result.hasMore); // Cek apakah masih ada data lagi
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setIsLoading(false);
  };

  // Fungsi observer untuk infinite scroll
  const lastItemRef = (node: HTMLElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          loadData(nextPage, inputValue);
          return nextPage;
        });
      }
    });

    if (node) observer.current.observe(node);
  };
  return (
    <div className="w-full">
      <Autocomplete
        label={label}
        placeholder={placeholder}
        inputValue={inputValue}
        onInputChange={(value) => setInputValue(value)}
        className="max-w-xs"
      >
        {data.map((item, index) => (
          <AutocompleteItem key={item.id} ref={data.length - 1 === index ? lastItemRef : null}>
            {item.name}
          </AutocompleteItem>
        ))}
        {isLoading && (
          <div className="p-2 text-center">
            <Spinner size="sm" /> Loading...
          </div>
        )}
      </Autocomplete>
    </div>
  );
}