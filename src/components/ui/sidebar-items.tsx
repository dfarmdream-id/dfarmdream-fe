import { type SidebarItem, SidebarItemType } from "./sidebar";

/**
 * Please check the https://nextui.org/docs/guide/routing to have a seamless router integration
 */

export const sectionNestedItems: SidebarItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: "heroicons-outline:home",
    can: "show:dashboard"
  },
  {
    key: "master",
    title: "Data Master",
    icon: "heroicons-outline:database",
    can: "show:master",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "positions",
        title: "Jabatan",
        href: "/master/positions",
        icon: "heroicons-outline:identification",
        can: "show:positions"
      },
      {
        key: "users",
        title: "Pengguna",
        href: "/master/users",
        icon: "heroicons-outline:user-group",
        can: "show:users"
      },
      {
        key: "sites",
        title: "Lokasi",
        href: "/master/site",
        icon: "heroicons-outline:map",
        can: "show:sites"
      },
      {
        key: "investors",
        title: "Investor",
        href: "/master/investors",
        icon: "heroicons-outline:user-add",
        can: "show:investors"
      },
      {
        key: "prices",
        title: "Harga",
        href: "/master/prices",
        icon: "heroicons-outline:tag",
        can: "show:prices"
      },
      {
        key: "roles",
        title: "Role",
        href: "/master/roles",
        icon: "heroicons-outline:shield-check",
        can: "show:roles"
      },
      {
        key: "permissions",
        title: "Permission",
        href: "/master/permissions",
        icon: "heroicons-outline:lock-closed",
        can: "show:permissions"
      }
    ]
  },
  {
    key: "transaction",
    title: "Transaksi",
    icon: "heroicons-outline:clipboard-list",
    can: "show:transaction",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "warehouse-transaction",
        title: "Transaksi Gudang",
        href: "/transaction/warehouse",
        icon: "tabler:building-warehouse",
        can: "show:warehouse-transaction"
      }
    ]
  },
  {
    key: "operational",
    title: "Operasional",
    icon: "heroicons-outline:clock",
    can: "show:operational",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "batch",
        title: "Batch Produksi",
        href: "/operational/batch",
        icon: "heroicons-outline:archive",
        can: "show:batch"
      },
      {
        key: "cages",
        title: "Kandang",
        href: "/operational/cages",
        icon: "heroicons-outline:inbox",
        can: "show:cages"
      },
      {
        key: "cctv",
        title: "CCTV",
        href: "/operational/cctv",
        icon: "heroicons-outline:video-camera",
        can: "show:cctv"
      },
      {
        key: "iot",
        title: "Perangkat IOT",
        href: "/operational/iot",
        icon: "heroicons-outline:chip",
        can: "show:sensor-iot"
      },
      {
        key: "sensor-device",
        title: "Sensor IOT",
        href: "/operational/sensor-device",
        icon: "heroicons-outline:beaker",
        can: "show:sensor-iot"
      },
      {
        key: "cage-racks",
        title: "Rak",
        href: "/operational/cage-racks",
        icon: "heroicons-outline:view-grid",
        can: "show:cage-racks"
      },
      {
        key: "chickens",
        title: "Ayam",
        href: "/operational/chickens",
        icon: "game-icons:chicken",
        can: "show:chickens"
      },
      {
        key: "chicken-diseases",
        title: "Penyakit Ayam",
        href: "/operational/chicken-diseases",
        icon: "fa-solid:disease",
        can: "show:chicken-diseases"
      },
      {
        key: "attendance",
        title: "Absen",
        href: "/operational/attendance-log",
        icon: "heroicons-outline:users",
        can: "show:attendance"
      },
      {
        key: "telegram-log",
        title: "Telegram Log",
        href: "/operational/telegram-log",
        icon: "heroicons-outline:paper-airplane",
        can: "show:telegram-log"
      }
    ]
  },
  {
    key: "cash-flow",
    title: "Keuangan",
    icon: "heroicons-outline:cash",
    can: "show:cash-flow",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "penerimaan-modal",
        title: "Penerimaan Modal",
        href: "/cash/penerimaan-modal",
        icon: "hugeicons:money-receive-01",
        can: "show:penerimaan-modal"
      },
      {
        key: "kategori-biaya",
        title: "Kategori Biaya",
        href: "/cash/kategori-biaya",
        icon: "heroicons-outline:clipboard-list",
        can: "show:kategori-biaya"
      },
      {
        key: "biaya",
        title: "Biaya",
        href: "/cash/biaya",
        icon: "heroicons-outline:currency-dollar",
        can: "show:biaya"
      },
      {
        key: "group-coa",
        title: "Group COA",
        href: "/cash/group-coa",
        icon: "heroicons-outline:collection",
        can: "show:group-coa"
      },
      {
        key: "coa",
        title: "COA",
        href: "/cash/coa",
        icon: "heroicons-outline:list-bullet",
        can: "show:coa"
      },
      {
        key: "journal-type",
        title: "Journal Type",
        href: "/cash/journal-type",
        icon: "heroicons-outline:bookmark",
        can: "show:journal-type"
      },
      {
        key: "template-journal",
        title: "Template Jurnal",
        href: "/cash/template-journal",
        icon: "heroicons-outline:bookmark-square",
        can: "show:template-journal-and-detail"
      },
      {
        key: "journal",
        title: "Jurnal",
        href: "/cash/journal",
        icon: "heroicons-outline:book-open",
        can: "show:journal"
      },
      {
        key: "balance-sheet",
        title: "Neraca",
        href: "/cash/balance-sheet",
        icon: "heroicons-outline:scale",
        can: "show:balance-sheet"
      },
      {
        key: "profit-loss",
        title: "Profit & Loss",
        href: "/cash/profit-loss",
        icon: "heroicons-outline:chart-bar",
        can: "show:profit-loss"
      }
    ]
  },
  {
    key: "barang",
    title: "Barang",
    icon: "heroicons-outline:cube",
    can: "show:barang",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "good",
        title: "Barang",
        href: "/stock/good",
        icon: "solar:box-linear",
        can: "show:barang"
      },
      {
        key: "persediaan-barang",
        title: "Persediaan Barang",
        href: "/stock/persediaan-barang",
        icon: "heroicons-outline:archive-box",
        can: "show:persediaan-barang"
      },
      {
        key: "transaksi-stok",
        title: "Kartu Stok Pakan Obat",
        href: "/stock/transaksi",
        icon: "hugeicons:apple-stocks",
        can: "show:kartu-stok"
      }
    ]
  }
];