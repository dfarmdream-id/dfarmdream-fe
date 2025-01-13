import { type SidebarItem, SidebarItemType } from "./sidebar";
import {
  HiBookmark, HiBookOpen,
  HiEye, HiOutlineBars3,
  HiOutlineClock, HiOutlineCog6Tooth,
  HiOutlineCurrencyDollar,
  HiOutlineHome,
  HiOutlineInbox, HiOutlineListBullet, HiOutlineRocketLaunch, HiOutlineUserPlus, HiOutlineUsers,
  HiOutlineWindow,
  HiPaperAirplane,
  HiUserGroup
} from "react-icons/hi2";
import {HiOutlineDatabase, HiOutlineInboxIn, HiOutlineLocationMarker, HiOutlineReceiptTax} from "react-icons/hi";
import {MdAccountTree, MdOutlineCollectionsBookmark, MdOutlineDeviceThermostat, MdSensors} from "react-icons/md";
import {GiChicken, GiMoneyStack} from "react-icons/gi";
import {FaBalanceScale, FaDisease, FaMoneyBillAlt} from "react-icons/fa";
import {TbAugmentedReality, TbBasketDown, TbBuildingWarehouse, TbCashRegister} from "react-icons/tb";
import {VscVariableGroup} from "react-icons/vsc";
import {IoFileTrayStacked} from "react-icons/io5";
import {CiBoxes} from "react-icons/ci";

export const sectionNestedItems: SidebarItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: "/dashboard",
    icon: <HiOutlineHome className="text-xl" />,
    can: "show:dashboard"
  },
  {
    key: "master",
    title: "Data Master",
    icon: <HiOutlineDatabase className="text-xl" />,
    can: "show:master",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "positions",
        title: "Jabatan",
        href: "/master/positions",
        icon: <HiOutlineUsers className="text-xl" />,
        can: "show:positions"
      },
      {
        key: "users",
        title: "Pengguna",
        href: "/master/users",
        icon: <HiOutlineUsers className="text-xl" />,
        can: "show:users"
      },
      {
        key: "sites",
        title: "Lokasi",
        href: "/master/site",
        icon: <HiOutlineLocationMarker className="text-xl" />,
        can: "show:sites"
      },
      {
        key: "investors",
        title: "Investor",
        href: "/master/investors",
        icon: <HiOutlineUserPlus className="text-xl" />,
        can: "show:investors"
      },
      {
        key: "prices",
        title: "Harga",
        href: "/master/prices",
        icon: <HiOutlineBars3 className="text-xl" />,
        can: "show:prices"
      },
      {
        key: "roles",
        title: "Role",
        href: "/master/roles",
        icon: <HiOutlineRocketLaunch className="text-xl" />,
        can: "show:roles"
      },
      {
        key: "permissions",
        title: "Permission",
        href: "/master/permissions",
        icon: <HiOutlineCog6Tooth className="text-xl" />,
        can: "show:permissions"
      }
    ]
  },
  {
    key: "transaction",
    title: "Transaksi",
    icon: <HiOutlineReceiptTax className="text-xl" />,
    can: "show:transaction",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "warehouse-transaction",
        title: "Transaksi Gudang",
        href: "/transaction/warehouse",
        icon: <HiOutlineWindow className="text-xl" />,
        can: "show:warehouse-transaction"
      }
    ]
  },
  {
    key: "operational",
    title: "Operasional",
    icon: <HiOutlineClock className="text-xl" />,
    can: "show:operational",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "batch",
        title: "Batch Produksi",
        href: "/operational/batch",
        icon: <IoFileTrayStacked className="text-xl" />,
        can: "show:batch"
      },
      {
        key: "cages",
        title: "Kandang",
        href: "/operational/cages",
        icon: <HiOutlineInbox className="text-xl" />,
        can: "show:cages"
      },
      {
        key: "cctv",
        title: "CCTV",
        href: "/operational/cctv",
        icon: <HiEye className="text-xl" />,
        can: "show:cctv"
      },
      {
        key: "iot",
        title: "Perangkat IOT",
        href: "/operational/iot",
        icon: <MdSensors className="text-xl" />,
        can: "show:sensor-iot"
      },
      {
        key: "sensor-device",
        title: "Sensor IOT",
        href: "/operational/sensor-device",
        icon: <MdOutlineDeviceThermostat className="text-xl" />,
        can: "show:sensor-iot"
      },
      {
        key: "cage-racks",
        title: "Rak",
        href: "/operational/cage-racks",
        icon: <HiOutlineInboxIn className="text-xl" />,
        can: "show:cage-racks"
      },
      {
        key: "chickens",
        title: "Ayam",
        href: "/operational/chickens",
        icon: <GiChicken className="text-xl" />,
        can: "show:chickens"
      },
      {
        key: "chicken-diseases",
        title: "Penyakit Ayam",
        href: "/operational/chicken-diseases",
        icon: <FaDisease className="text-xl" />,
        can: "show:chicken-diseases"
      },
      {
        key: "attendance",
        title: "Absen",
        href: "/operational/attendance-log",
        icon: <HiUserGroup className="text-xl" />,
        can: "show:attendance"
      },
      {
        key: "telegram-log",
        title: "Telegram Log",
        href: "/operational/telegram-log",
        icon: <HiPaperAirplane className="text-xl" />,
        can: "show:telegram-log"
      }
    ]
  },
  {
    key: "cash-flow",
    title: "Keuangan",
    icon: <HiOutlineCurrencyDollar className="text-xl" />,
    can: "show:cash-flow",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "penerimaan-modal",
        title: "Penerimaan Modal",
        href: "/cash/penerimaan-modal",
        icon: <TbCashRegister className="text-xl" />,
        can: "show:penerimaan-modal"
      },
      {
        key: "kategori-biaya",
        title: "Kategori Biaya",
        href: "/cash/kategori-biaya",
        icon: <VscVariableGroup className="text-xl" />,
        can: "show:kategori-biaya"
      },
      {
        key: "biaya",
        title: "Biaya",
        href: "/cash/biaya",
        icon: <FaMoneyBillAlt className="text-xl" />,
        can: "show:biaya"
      },
      {
        key: "group-coa",
        title: "Group COA",
        href: "/cash/group-coa",
        icon: <MdAccountTree className="text-xl" />,
        can: "show:group-coa"
      },
      {
        key: "coa",
        title: "COA",
        href: "/cash/coa",
        icon: <HiOutlineListBullet className="text-xl" />,
        can: "show:coa"
      },
      {
        key: "journal-type",
        title: "Journal Type",
        href: "/cash/journal-type",
        icon: <MdOutlineCollectionsBookmark className="text-xl" />,
        can: "show:journal-type"
      },
      {
        key: "template-journal",
        title: "Template Jurnal dan Detail",
        href: "/cash/template-journal",
        icon: <HiBookmark className="text-xl" />,
        can: "show:template-journal-and-detail"
      },
      {
        key: "journal",
        title: "Jurnal",
        href: "/cash/journal",
        icon: <HiBookOpen className="text-xl" />,
        can: "show:journal"
      },
      {
        key: "balance-sheet",
        title: "Neraca",
        href: "/cash/balance-sheet",
        icon: <FaBalanceScale className="text-xl" />,
        can: "show:balance-sheet"
      },
      {
        key: "profit-loss",
        title: "Profit & Loss",
        href: "/cash/profit-loss",
        icon: <GiMoneyStack className="text-xl" />,
        can: "show:profit-loss"
      }
    ]
  },
  {
    key: "barang",
    title: "Barang",
    icon: <CiBoxes className="text-xl" />,
    can: "show:barang",
    type: SidebarItemType.Nest,
    items: [
      {
        key: "good",
        title: "Barang",
        href: "/stock/good",
        icon: <TbAugmentedReality className="text-xl" />,
        can: "show:barang"
      },
      {
        key: "persediaan-barang",
        title: "Persediaan Barang",
        href: "/stock/persediaan-barang",
        icon: <TbBasketDown className="text-xl" />,
        can: "show:persediaan-barang"
      },
      {
        key: "transaksi-stok",
        title: "Kartu Stok Pakan Obat",
        href: "/stock/transaksi",
        icon: <TbBuildingWarehouse className="text-xl" />,
        can: "show:kartu-stok"
      }
    ]
  }
];