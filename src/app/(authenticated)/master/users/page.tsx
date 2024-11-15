"use client";
import { HiSearch } from "react-icons/hi";
import { HiPlus } from "react-icons/hi2";
import { useQueryState } from "nuqs";
import { useState } from "react";

const rows = [
  {
    id: "SKFM0001",
    name: "Rizky Tri Wahyudi",
    role: "Farm Manager",
    location: "Majalengka",
    address: "Jl. Dempo 4 No.41 Kel. Abadijaya Kel.Sukmajaya",
    phone: "0812-1936-2356",
    ktp: "3276 0101 010101 0001",
    status: "Aktif",
  },
  {
    id: "SKOP0001",
    name: "Jahe",
    role: "Operator",
    location: "Sukabumi",
    address: "Jl. Dempo 4 No.41 Kel. Sukmajaya",
    phone: "0812-6335-2933",
    ktp: "3276 0101 010101 1232",
    status: "Aktif",
  },
];

export default function Page() {
  const [search, setSearch] = useQueryState("q");
  const [page, setPage] = useState(1);
  const totalPages = 5;

  return (
    <div className="p-5">
      <div className="text-3xl font-bold mb-10">Data Pengguna</div>

      {/* Table Container with Border, Shadow, Search Bar, and Add Button */}
      <div className="border border-gray-300 shadow-lg rounded-lg overflow-hidden">
        
        {/* Search and Add Button Section (Inside Table) */}
        <div className="flex justify-between items-center p-4 bg-white border-b border-gray-300">
          
          {/* Left section with "Tampilkan data" and search bar */}
          <div className="flex items-center space-x-4">
            {/* Dropdown for "Tampilkan data" */}
            <div className="flex items-center space-x-2">
              <label htmlFor="show-data" className="text-gray-700 text-xs">Tampilkan</label>
              <select
                id="show-data"
                className="border border-gray-300 rounded-md p-1 text-xs"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span className="text-gray-700 text-xs">data</span>
            </div>

            {/* Search bar */}
            <div className="flex items-center border border-gray-300 rounded-md p-1 w-35">
              <HiSearch className="mr-2 text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Cari Pengguna"
                className="outline-none flex-grow text-xs"
                value={search || ""}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Add Button */}
          <button className="bg-green-500 text-white px-4 py-1 rounded-lg flex items-center shadow-md">
            <HiPlus className="mr-2" /> Tambah Karyawan
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-8 bg-white text-sm font-semibold p-3 border-b border-gray-300 text-center">
          <div>ID</div>
          <div>Nama</div>
          <div>Jabatan</div>
          <div>Lokasi</div>
          <div>Alamat</div>
          <div>No HP</div>
          <div>No KTP</div>
          <div>Status</div>
        </div>

        {/* Table Body */}
        <div>
          {rows.map((item, index) => (
            <div
            key={item.id}
            className={`grid grid-cols-8 p-2 ${index % 2 === 0 ? "bg-green-100" : "bg-white"} text-xs border-b border-gray-300`}
          >
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.id}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.name}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.role}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.location}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.address}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.phone}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>{item.ktp}</div>
            <div className="flex items-center justify-center h-full" style={{ paddingTop: "2px" }}>
              <span
                className="py-0.5 px-2 rounded-full shadow-sm bg-white text-green-500 text-xs"
                style={{
                  display: "inline-block",
                  textAlign: "center",
                  boxShadow: "0px 1px 3px rgba(0, 128, 0, 0.3)",
                }}
              >
                {item.status}
              </span>
            </div>
          </div>
          ))}
        </div>

        {/* Pagination - Now Inside the Table Container */}
        <div className="flex justify-center items-center py-3 bg-white space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-2 py-1 text-gray-600 hover:bg-gray-200 text-sm rounded-md"
          >
            Sebelumnya
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setPage(index + 1)}
              className={`px-2 py-1 text-sm border rounded-md ${
                page === index + 1
                  ? "bg-green-500 text-white"
                  : "border-gray-300 hover:bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-2 py-1 text-gray-600 hover:bg-gray-200 text-sm rounded-md"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}
