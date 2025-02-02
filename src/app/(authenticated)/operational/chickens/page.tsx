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
  Select,
  SelectItem,
  Spinner,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Chip,
  Autocomplete,
  AutocompleteItem,
  DateRangePicker,
} from "@nextui-org/react";
import { HiOutlineFilter, HiSearch } from "react-icons/hi";
import { HiPlus, HiQrCode } from "react-icons/hi2"; // Contoh Icon Print
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import { DateTime } from "luxon";

import Actions from "./_components/actions";
import EmptyState from "@/components/state/empty";
import { useGetChickens, useUpdateChicken } from "../../_services/chicken";
import { Can } from "@/components/acl/can";
import { useGetChickenDiseases } from "@/app/(authenticated)/_services/chicken-disease";
import {
  ChickenStatus,
  chickenStatus,
  getStatusProps,
} from "@/app/(authenticated)/operational/chickens/_const/status.const";
import { useGetCages } from "@/app/(authenticated)/_services/cage";
import useLocationStore from "@/stores/useLocationStore";
import FilterBatch from "@/app/(authenticated)/_components/filterBatch";
import FilterRack from "@/app/(authenticated)/_components/filterRack";
import { useAuthStore } from "@/app/auth/_store/auth";

// === [1] Import Zustand store for printing chicken
import useChickenPrintStore from "@/stores/useChickenPrintStore";

const columns = [
  { key: "batch", label: "Batch" },
  { key: "fullName", label: "ID Ayam" },
  { key: "role", label: "Rak" },
  { key: "cage", label: "Kandang" },
  { key: "status", label: "Status" },
  { key: "AlasanPenyakit", label: "Alasan Penyakit" },
  { key: "createdAt", label: "Tanggal Dibuat" },
  { key: "updatedAt", label: "Tanggal Diubah" },
  { key: "action", label: "Aksi" },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q", { throttleMs: 1000 });
  const [page, setPage] = useQueryState("page", { throttleMs: 1000 });
  const [limit, setLimit] = useQueryState("limit", { throttleMs: 1000 });

  // States filter, modal, dsb.
  const { siteId } = useLocationStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [statusSelected, setStatusSelected] = useState<string | null>(null);
  const [diseaseSelected, setDiseaseSelected] = useState<string | null>(null);
  const [statusSelectedFilter, setStatusSelectedFilter] = useState<string | null>(null);
  const [diseaseSelectedFilter, setDiseaseSelectedFilter] = useState<string | null>(null);
  const [batchId, setBatchId] = useState<string | null>(null);
  const [cageId, setCageId] = useState<string | null>(null);
  const [rackId, setRackId] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<string | null>(null);
  const [idSelected, setIdSelected] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // === [2] State for table selection
  const [selectedKeys, setSelectedKeys] = useState<Set<React.Key>>(new Set());

  // === [3] From the print store
  const { setSelectedKeys: setPrintChickens } = useChickenPrintStore();

  // Query data
  const user = useGetChickens(
    useMemo(() => {
      const params: Record<string, string> = {
        q: search || "",
        page: page || "1",
        limit: limit || "10",
      };
      if (batchId) params.batchId = batchId;
      if (cageId) params.cageId = cageId;
      if (rackId) params.rackId = rackId;
      if (dateRange) params.dateRangeFilter = dateRange;
      if (statusSelectedFilter) params.status = statusSelectedFilter;
      if (diseaseSelectedFilter) params.diseaseId = diseaseSelectedFilter;
      return params;
    }, [search, page, limit, batchId, cageId, rackId, dateRange, statusSelectedFilter, diseaseSelectedFilter])
  );

  const diseases = useGetChickenDiseases(
    useMemo(() => ({ page: "1", limit: "100" }), [])
  );
  const cagesData = useGetCages(
    useMemo(() => ({ page: "1", limit: "10000", siteId: siteId ?? "" }), [siteId])
  );
  const submission = useUpdateChicken();
  const permissions = useAuthStore((state) => state.permissions);

  // Data array
  const rows = useMemo(() => {
    if (user.data) {
      if (parseInt(page || "1") > user.data?.data?.meta?.totalPage) {
        setPage(
          user.data?.data?.meta?.totalPage == 0
            ? "1"
            : user.data?.data?.meta?.totalPage.toString()
        );
      }
      return user.data?.data?.data || [];
    }
    return [];
  }, [user.data]);

  // Handler status update
  const handleStatus = (data: { id: string; status: string }) => {
    setIdSelected(data.id);
    onOpen();
  };

  const handleSubmitData = () => {
    submission.mutate(
      {
        pathVars: { id: idSelected },
        body: {
          status: statusSelected ?? null,
          ...(statusSelected === "ALIVE_IN_SICK" ||
          statusSelected === "DEAD_DUE_TO_ILLNESS"
            ? { diseaseId: diseaseSelected }
            : { diseaseId: null }),
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

  // === [4] onSelectionChange => Update local selectedKeys + store data
  function handleSelectionChange(keys: "all" | Iterable<React.Key> | undefined) {
    if (!keys || keys === "all") {
      // Jika user menekan "select all", handle sesuai kebutuhan. 
      // Di sini kita kosongkan saja.
      setSelectedKeys(new Set());
      setPrintChickens([]);
      return;
    }

    const newKeys = Array.from(keys) as string[];
    setSelectedKeys(new Set(newKeys));

    // Map data => store
    const mappedChickens = newKeys.map((id) => {
      const found = rows.find((row) => row.id === id);
      return {
        id: found?.id || "",
        location: found?.rack?.cage?.site?.name || "",
        kandang: found?.rack?.cage?.name || "",
        rack: found?.rack?.name || "",
        batch: found?.batch?.name || "",
      };
    });
    setPrintChickens(mappedChickens);
  }

  // === [5] Handler Print
  function handlePrint() {
    // Data already in store => just open new window
    window.open("/qr-print/chicken/print?print=true", "_blank");
  }

  return (
    <div className="p-5">
      {/* Filter Modal */}
      <Modal isOpen={showFilter} onClose={() => setShowFilter(false)}>
        <ModalContent>
          <Form
            action=""
            onSubmit={() => {
              setShowFilter(false);
            }}
          >
            <ModalHeader>Filter Data</ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 gap-3">
                <FilterBatch
                  batchId={batchId}
                  disableLabel={true}
                  onBatchIdChange={(val) => {
                    setBatchId(val);
                  }}
                />
                <Select
                  isLoading={cagesData.isLoading}
                  labelPlacement="outside"
                  placeholder="Pilih Kandang"
                  variant="bordered"
                  selectedKeys={[cageId as string]}
                  onChange={(e) => {
                    setCageId(e.target.value);
                  }}
                >
                  {cagesData.data?.data?.data?.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name}
                    </SelectItem>
                  )) || []}
                </Select>

                <FilterRack
                  onRackIdChange={(val) => setRackId(val)}
                  cageId={cageId}
                  disableLabel={true}
                />

                <DateRangePicker
                  onChange={(e) => {
                    const str = e.start.toString() + "," + e.end.toString();
                    setDateRange(str);
                  }}
                  labelPlacement="outside"
                  variant="bordered"
                />

                <Select
                  className="w-100"
                  items={chickenStatus}
                  variant="bordered"
                  label="Status Ayam"
                  placeholder="Pilih Status Ayam"
                  selectedKeys={[statusSelectedFilter as string]}
                  onChange={(e) => setStatusSelectedFilter(e.target.value)}
                >
                  {chickenStatus.map((status) => (
                    <SelectItem key={status.key} value={status.key}>
                      {status.label}
                    </SelectItem>
                  ))}
                </Select>

                {(statusSelectedFilter === "ALIVE_IN_SICK" ||
                  statusSelectedFilter === "DEAD_DUE_TO_ILLNESS") && (
                  <Autocomplete
                    onSelectionChange={(value) =>
                      setDiseaseSelectedFilter(value as string)
                    }
                    selectedKey={diseaseSelectedFilter}
                    variant="bordered"
                    className="w-100"
                    label="Pilih Alasan Penyakit"
                  >
                    {diseases?.data?.data?.data.map((d) => (
                      <AutocompleteItem key={d.id}>{d.name}</AutocompleteItem>
                    )) ?? []}
                  </Autocomplete>
                )}
              </div>
            </ModalBody>
            <ModalFooter className="grid grid-cols-2">
              <Button
                variant="bordered"
                onPress={() => {
                  setBatchId(null);
                  setCageId(null);
                  setDateRange(null);
                  setRackId(null);
                  setStatusSelectedFilter(null);
                  setDiseaseSelectedFilter(null);
                  setShowFilter(false);
                }}
              >
                Batal
              </Button>
              <Button color="primary" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      <div className="text-3xl font-bold mb-10">Data Ayam</div>
      <div className="space-y-5 bg-white p-5 rounded-lg">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div className="flex gap-3 items-center flex-wrap md:flex-nowrap">
            <Input
              startContent={<HiSearch />}
              placeholder="Cari Ayam"
              variant="bordered"
              value={search || ""}
              onValueChange={setSearch}
            />
            <div>
              <Button
                startContent={<HiOutlineFilter />}
                onPress={() => {
                  setShowFilter(!showFilter);
                }}
              >
                Filter Data
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* === [6] Tombol Print, tampilkan hanya bila ada item terpilih */}
            <Can action="print:qr-chicken">
              {selectedKeys.size > 0 && (
                <Button
                  variant="bordered"
                  color="default"
                  startContent={<HiQrCode />}
                  onPress={handlePrint}
                >
                  Print QR
                </Button>
              )}
            </Can>
            <Can action="create:chicken">
              <Button
                as={Link}
                href="/operational/chickens/create"
                color="primary"
                startContent={<HiPlus />}
                className="w-full md:w-auto"
              >
                Tambah Ayam
              </Button>
            </Can>
          </div>
        </div>

        {/* === [7] Table with multiple selection */}
        <Table
          aria-label="Data"
          selectionMode="multiple"
          // @ts-ignore
          selectedKeys={selectedKeys}
          onSelectionChange={handleSelectionChange}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>

          <TableBody
            items={rows}
            isLoading={user.isLoading}
            loadingContent={<Spinner />}
            emptyContent={<EmptyState />}
          >
            {(item) => (
              <TableRow
                key={item.id}
                className="odd:bg-[#cffdec]"
                role="button"
              >
                <TableCell>
                  <div>{item?.batch?.name ?? "-"}</div>
                </TableCell>
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
                      getStatusProps(item.status as ChickenStatus).color as
                        | "success"
                        | "primary"
                        | "default"
                        | "secondary"
                        | "warning"
                        | "danger"
                        | undefined
                    }
                    className="text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      
                      if (
                        permissions.includes("update:chicken") ||
                        permissions.includes("*")
                      ) {
                        handleStatus(item);
                      }
                    }}
                  >
                    {getStatusProps(item.status as ChickenStatus).label}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div>{item?.disease?.name ?? "-"}</div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.createdAt, { zone: "local" }).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    {DateTime.fromISO(item.updatedAt, { zone: "local" }).toLocaleString(
                      DateTime.DATETIME_MED_WITH_WEEKDAY,
                      { locale: "id" }
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Actions id={item.id} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination & Limit */}
        <div className="flex justify-between">
          <Select
            className="w-40"
            label="Tampilkan"
            onChange={(e) => {
              setLimit(e.target.value);
            }}
            labelPlacement="outside-left"
            classNames={{ base: "flex items-center" }}
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

      {/* Modal Update Status */}
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
                  {chickenStatus.map((st) => (
                    <SelectItem key={st.key} value={st.key}>
                      {st.label}
                    </SelectItem>
                  ))}
                </Select>

                {(statusSelected === "ALIVE_IN_SICK" ||
                  statusSelected === "DEAD_DUE_TO_ILLNESS") && (
                  <Autocomplete
                    onSelectionChange={(value) => setDiseaseSelected(value as string)}
                    variant="bordered"
                    className="w-100"
                    label="Pilih Alasan Penyakit"
                  >
                    {diseases?.data?.data?.data.map((st) => (
                      <AutocompleteItem key={st.id}>{st.name}</AutocompleteItem>
                    )) ?? []}
                  </Autocomplete>
                )}
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