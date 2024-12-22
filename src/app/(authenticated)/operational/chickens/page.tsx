"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Chip,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import {HiSearch} from "react-icons/hi";
import {HiPlus} from "react-icons/hi2";
import {useQueryState} from "nuqs";
import {useMemo, useState} from "react";
import Link from "next/link";
import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import {useGetChickens, useUpdateChicken} from "../../_services/chicken";
import {Can} from "@/components/acl/can";
import {DateTime} from "luxon";
import {useGetChickenDiseases} from "@/app/(authenticated)/_services/chicken-disease";
import {
  ChickenStatus,
  chickenStatus,
  getStatusProps
} from "@/app/(authenticated)/operational/chickens/_const/status.const";
import {useGetCages} from "@/app/(authenticated)/_services/cage";
import {useGetCageRacks} from "@/app/(authenticated)/_services/rack";
import useLocationStore from "@/stores/useLocationStore";
import {BiX} from "react-icons/bi";

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
  
  const { siteId } = useLocationStore();

  const {isOpen, onOpen, onClose} = useDisclosure();
  const [statusSelected, setStatusSelected] = useState<string | null>(null);
  const [diseaseSelected, setDiseaseSelected] = useState<string | null>(null);
  const [cageSelected, setCageSelected] = useState("");
  const [rackSelected, setRackSelected] = useState("");
  const [idSelected, setIdSelected] = useState("");

  const user = useGetChickens(
    useMemo(
      () => ({q: search || "", page: page || "1", limit: limit || "10", rackId: rackSelected ?? null}),
      [search, page, limit, rackSelected]
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
        pathVars: { id: idSelected },
        body: {
          status: statusSelected ?? null, // Kirim null jika statusSelected tidak ada
          ...(statusSelected === "ALIVE_IN_SICK" || statusSelected === "DEAD_DUE_TO_ILLNESS"
            ? { diseaseId: diseaseSelected } // Kirim diseaseId jika status sesuai
            : { diseaseId: null }), // Jangan kirim apa-apa jika status tidak sesuai
        },
      },
      {
        onError: (error) => {
          console.log(error);
        },
        onSuccess: async () => {
          onClose();
          await user.refetch();
        },
      }
    );
  };

  const rows = useMemo(() => {
      if (user.data) {
        return user.data?.data?.data || [];
      }
      return [];
    }, [user.data]);

  const cagesData = useGetCages(
    useMemo(
      () => ({ page: "1", limit: "10000", siteId: siteId ?? "" }),
      [siteId]
    )
  );

  const rackData = useGetCageRacks(
    useMemo(() => ({ page: "1", limit: "100", cageId: cageSelected }), [cageSelected])
  );

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
              <Select
                isLoading={cagesData.isLoading}
                labelPlacement="outside"
                placeholder="Pilih Kandang"
                variant="bordered"
                defaultSelectedKeys={[cageSelected]} // Pastikan ini mengikuti state
                onChange={(e) => setCageSelected(e.target.value)} // Perbarui state saat dipilih
              >
                {cagesData.data?.data?.data?.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                )) || []}
              </Select>

              <Select
                isLoading={rackData.isLoading}
                labelPlacement="outside"
                placeholder="Pilih Rak"
                variant="bordered"
                defaultSelectedKeys={[rackSelected]} // Pastikan ini mengikuti state
                onChange={(e) => setRackSelected(e.target.value)} // Perbarui state saat dipilih
              >
                {rackData.data?.data?.data?.map((position) => (
                  <SelectItem key={position.id} value={position.id}>
                    {position.name}
                  </SelectItem>
                )) || []}
              </Select>

              {rackSelected && (
                <Button
                  color="danger"
                  size="sm"
                  onClick={() => {
                    setRackSelected(""); // Reset state rackSelected
                    setCageSelected(""); // Reset state cageSelected
                  }}
                >
                  <BiX
                    className="text-white"
                    style={{width: 25, height: 25}}
                  />
                </Button>
              )}
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
                      color={getStatusProps(item.status as ChickenStatus).color as "success" | "primary" | "default" | "secondary" | "warning" | "danger" | undefined} // Pastikan status cocok dengan tipe
                      className="text-white"
                      onClick={() => handleStatus(item)} // Tetap menggunakan logika klik
                    >
                      {getStatusProps(item.status as ChickenStatus).label}
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
                    items={chickenStatus}
                    variant="bordered"
                    label="Status Ayam"
                    placeholder="Pilih Status Ayam"
                    onChange={(e) => setStatusSelected(e.target.value)}
                  >
                    {(status) => <SelectItem key={status.key} value={status.key}>{status.label}</SelectItem>}
                  </Select>
                  {
                    (statusSelected === "ALIVE_IN_SICK" || statusSelected === "DEAD_DUE_TO_ILLNESS") && (
                      <Autocomplete
                        onSelectionChange={(value) => setDiseaseSelected(
                          value as string
                        )} // Perbarui state
                        variant="bordered" className="w-100" label="Pilih Alasan Penyakit">
                        {diseases?.data?.data?.data.map((status) => (
                          <AutocompleteItem key={status.id}>{status.name}</AutocompleteItem>
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