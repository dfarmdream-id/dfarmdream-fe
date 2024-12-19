"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Input,
  Chip,
  Spinner,
  Select,
  SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure,
  Autocomplete, AutocompleteItem,
} from "@nextui-org/react";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import {useMemo, useState} from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import {useGetChickens, useUpdateChicken} from "../../_services/chicken";
import { Can } from "@/components/acl/can";
import {DateTime} from "luxon";
import {useGetChickenDiseases} from "@/app/(authenticated)/_services/chicken-disease";

const columns = [
  {
    key: "fullName",
    label: "Nama",
  },
  {
    key: "role",
    label: "Rak",
  },
  {
    key: "cage",
    label: "Kandang",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "AlasanPenyakit",
    label: "Alasan Penyakit",
  },
  {
    key: "createdAt",
    label: "Tanggal Dibuat",
  },
  {
    key: "updatedAt",
    label: "Tanggal Diubah",
  },
  {
    key: "action",
    label: "Aksi",
  },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q", {
    throttleMs: 1000,
  });
  const [page, setPage] = useQueryState("page", {
    throttleMs: 1000,
  });
  const [limit, setLimit] = useQueryState("limit", {
    throttleMs: 1000,
  });

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [statusSelected, setStatusSelected] = useState("");
  const [diseaseSelected, setDiseaseSelected] = useState("");
  const [idSelected, setIdSelected] = useState("");

  const user = useGetChickens(
    useMemo(
      () => ({q: search || "", page: page || "1", limit: limit || "10"}),
      [search, page, limit]
    )
  );
  
  const diseases = useGetChickenDiseases(
    useMemo(
      () => ({page: "1", limit:  "100000"}),
      []
    )
  );

  const submission = useUpdateChicken();

  const handleStatus = (data: {
    id: string;
    status: string;
  }) => {
    if (data) {
      setIdSelected(data.id);
      onOpen();
    }
  }
  const handleSubmitData = () => {
    submission.mutate(
      {
        pathVars: {id: idSelected},
        body: {
          status: statusSelected,
          diseaseId: diseaseSelected,
        }
      },
      {
        onError: (error) => {
          console.log(error);
        },
        onSuccess: async () => {
          onClose();
          await user.refetch()
        },
      }
    );
  }

  const status = [
    { key: "ALIVE", label: "Ayam Hidup dan Sehat" },
    { key: "ALIVE_IN_SICK", label: "Ayam Hidup tetapi Mengalami Penyakit" },
    { key: "DEAD", label: "Ayam Mati tanpa Tanda Penyakit" },
    { key: "DEAD_DUE_TO_ILLNESS", label: "Ayam Mati karena Penyakit" },
  ];

    const rows = useMemo(() => {
      if (user.data) {
        // Ambil data
        const rawData = user.data?.data?.data || [];

        // Sorting data berdasarkan hierarki
        return rawData.sort((a, b) => {
          // Urutkan berdasarkan cage.name (case-insensitive)
          const cageNameA = a?.rack?.cage?.name?.toLowerCase() ?? "";
          const cageNameB = b?.rack?.cage?.name?.toLowerCase() ?? "";
          if (cageNameA < cageNameB) return -1;
          if (cageNameA > cageNameB) return 1;

          // Jika cage.name sama, urutkan berdasarkan rack.name
          const rackNameA = a?.rack?.name?.toLowerCase() ?? "";
          const rackNameB = b?.rack?.name?.toLowerCase() ?? "";
          if (rackNameA < rackNameB) return -1;
          if (rackNameA > rackNameB) return 1;

          // Jika rack.name sama, urutkan berdasarkan name (user)
          const userNameA = a.name.toLowerCase();
          const userNameB = b.name.toLowerCase();
          return userNameA.localeCompare(userNameB, undefined, {
            numeric: true, // Perhatikan angka saat sorting
            sensitivity: 'base', // Case-insensitive
          });
        });
      }
      return [];
    }, [user.data]);

    return (
      <div className="p-5">
        <div className="text-3xl font-bold mb-10">Data Ayam</div>
        <div className="space-y-5 bg-white p-5 rounded-lg">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">

              <Input
                startContent={<HiSearch/>}
                placeholder="Cari Ayam"
                variant="bordered"
                value={search || ""}
                onValueChange={setSearch}
              />
            </div>
            <Can action="create:chicken">
              <Button
                as={Link}
                href="/operational/chickens/create"
                color="primary"
                startContent={<HiPlus/>}
                className="w-full md:w-auto"
              >
                Tambah Ayam
              </Button>
            </Can>
          </div>
          <Table aria-label="Data">
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn key={column.key}>{column.label}</TableColumn>
              )}
            </TableHeader>
            <TableBody
              items={rows}
              isLoading={user.isLoading}
              loadingContent={<Spinner/>}
              emptyContent={<EmptyState/>}
            >
              {(item) => (
                <TableRow
                  key={item.id}
                  className="odd:bg-[#cffdec]"
                  role="button"
                >
                  <TableCell>
                    <div>{item.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item?.rack?.name}</div>
                  </TableCell>
                  <TableCell>
                    <div>{item?.rack?.cage?.name}</div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={
                        item.status === "ALIVE" ? "success" :
                        item.status === "ALIVE_IN_SICK" ? "warning" :
                        item.status === "DEAD" ? "danger" :
                        item.status === "DEAD_DUE_TO_ILLNESS" ? "danger" : "primary"
                      }
                      className="text-white"
                      onClick={() => handleStatus(item)}
                    >
                      {
                        item.status === "ALIVE" ? "Hidup" :
                        item.status === "ALIVE_IN_SICK" ? "Hidup Sakit" :
                        item.status === "DEAD" ? "Mati" :
                        item.status === "DEAD_DUE_TO_ILLNESS" ? "Mati Sakit" : ""
                      }
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div>{item?.disease?.name ?? '-'}</div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {DateTime.fromISO(item.createdAt, {zone: 'local'}).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        {locale: 'id'}
                      )} 
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {DateTime.fromISO(item.updatedAt, {zone: 'local'}).toLocaleString(
                        DateTime.DATETIME_MED_WITH_WEEKDAY,
                        {locale: 'id'}
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Actions id={item.id}/>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <div className="flex justify-between">
            <Select
              className="w-40"
              label="Tampilkan"
              onChange={(e) => {
                setLimit(e.target.value);
              }}
              labelPlacement="outside-left"
              classNames={{base: "flex items-center"}}
              selectedKeys={[limit?.toString() || "10"]}
            >
              <SelectItem key="10">10</SelectItem>
              <SelectItem key="20">20</SelectItem>
              <SelectItem key="30">30</SelectItem>
              <SelectItem key="40">40</SelectItem>
              <SelectItem key="50">50</SelectItem>
            </Select>
            <Pagination
              color="primary"
              total={user.data?.data?.meta?.totalPage || 1}
              initialPage={1}
              page={user.data?.data?.meta?.page || 1}
              onChange={(page) => setPage(page.toString())}
            />
          </div>
        </div>

        <Modal isOpen={isOpen} size="xl" onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Update Status Ayam
                </ModalHeader>
                <ModalBody>
                  <Select
                    className="w-100"
                    items={status}
                    variant="bordered"
                    label="Status Ayam"
                    placeholder="Pilih Status Ayam"
                    onChange={(e) => setStatusSelected(e.target.value)}
                  >
                    {(animal) => <SelectItem key={animal.key} value={animal.key}>{animal.label}</SelectItem>}
                  </Select>
                  {
                    (statusSelected === "ALIVE_IN_SICK" || statusSelected === "DEAD_DUE_TO_ILLNESS") && (
                      <Autocomplete
                        onSelectionChange={(value) => setDiseaseSelected(
                          value as string
                        )} // Perbarui state
                        variant="bordered" className="w-100" label="Pilih Alasan Penyakit">
                        {diseases?.data?.data?.data.map((animal) => (
                          <AutocompleteItem key={animal.id}>{animal.name}</AutocompleteItem>
                        )) ?? []}
                      </Autocomplete>
                    )
                  }
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Keluar
                  </Button>
                  <Button color="primary" onPress={handleSubmitData}>
                    Update
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    );
}