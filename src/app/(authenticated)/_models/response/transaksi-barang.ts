
export interface GetListTransaksiBarangResponse {
    message: string;
    data: Data;
    status: number;
  }
  
  export interface GetTransaksiBarangResponse {
    message: string;
    data: Daum;
    status: number;
  }
  
  export interface Data {
    data: Daum[];
    meta: Meta;
  }
  
  export interface Daum{
    id:string;
    tanggal:string;
    barangId:string;
    barang:Barang;
    site:Site;
    cage:Cage
    qtyAsal:number;
    qtyOut:number;
    qtyIn:number;
    qtyAkhir:number;
    karyawanId:number;
    karyawan:Karyawan
    siteId:string;
    cageId:string;
    keterangan:string;
    harga:number;
    total:number;
    status:number;
    createdAt:Date
  }

  export interface Karyawan{
    id:string;
    fullName:string;
  }

  export interface Barang {
    id:string;
    namaBarang:string;
    qty:number;
    harga:number;
    total:number;
    siteId:string;
    cageId:string;
    status:number;
    tipeBarang:string;
    site:Site;
    cage:Cage
  }
  
  export interface Meta {
    limit: number;
    page: number;
    totalData: number;
    totalPage: number;
  }
  
  export interface KategoriBiaya{
    id: string;
    namaKategori:string
    kodeAkun:string;
  }

  export interface Site{
    id: string;
    name: string;
  }

  export interface Cage{
    id: string;
    name: string;
  }