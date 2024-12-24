import {
  HiBookmark, HiBookOpen,
  HiEye, HiOutlineBars3,
  HiOutlineClock, HiOutlineCog6Tooth,
  HiOutlineCurrencyDollar,
  HiOutlineHome,
  HiOutlineInbox, HiOutlineListBullet, HiOutlineRocketLaunch, HiOutlineUserPlus, HiOutlineUsers,
  HiOutlineWindow,
  HiUserGroup
} from "react-icons/hi2";
import {HiOutlineDatabase, HiOutlineInboxIn, HiOutlineLocationMarker, HiOutlineReceiptTax} from "react-icons/hi";
import {MdOutlineCollectionsBookmark, MdOutlineDeviceThermostat, MdSensors} from "react-icons/md";
import {GiChicken, GiMoneyStack} from "react-icons/gi";
import {FaBalanceScale, FaBox, FaDisease, FaMoneyBillAlt} from "react-icons/fa";
import {TbAugmentedReality, TbBasketDown, TbBuildingWarehouse, TbCashRegister} from "react-icons/tb";
import {VscVariableGroup} from "react-icons/vsc";

export const menus = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HiOutlineHome className="text-xl" />,
    can: "show:dashboard",
  },
  {
    icon: <HiOutlineReceiptTax className="text-xl" />,
    label: "Transaksi",
    key: "transaction",
    can: "show:transaction",
    children: [
      {
        can: "show:warehouse-transaction",
        label: "Transaksi Gudang",
        href: "/transaction/warehouse",
        icon: <HiOutlineWindow className="text-xl" />,
      },
      // {
      //   can: "show:sales-transaction",
      //   label: "Transaksi Penjualan",
      //   href: "/transaction/sales",
      //   icon: <HiOutlineCurrencyDollar className="text-xl" />,
      // },
    ],
  },
  {
    can: "show:operational",
    icon: <HiOutlineClock className="text-xl" />,
    label: "Operasional",
    key: "operational",
    children: [
      {
        can: "show:cages",
        label: "Kandang",
        href: "/operational/cages",
        icon: <HiOutlineInbox className="text-xl" />,
      },
      {
        label: "CCTV",
        href: "/operational/cctv",
        icon: <HiEye className="text-xl" />,
        can: "show:cctv",
      },
      {
        label: "Perangkat IOT",
        href: "/operational/iot",
        icon: <MdSensors className="text-xl" />,
        can: "show:sensor-iot",
      },
      {
        label: "Sensor IOT",
        href: "/operational/sensor-device",
        icon: <MdOutlineDeviceThermostat className="text-xl" />,
        can: "show:sensor-iot",
      },
      {
        can: "show:cage-racks",
        label: "Rak",
        href: "/operational/cage-racks",
        icon: <HiOutlineInboxIn className="text-xl" />,
      },
      {
        can: "show:chickens",
        label: "Ayam",
        href: "/operational/chickens",
        icon: <GiChicken className="text-xl" />,
      },
      {
        can: "show:chicken-diseases",
        label: "Penyakit Ayam",
        href: "/operational/chicken-diseases",
        icon: <FaDisease className="text-xl" />,
      },
      {
        can: "show:attendance",
        label: "Absen",
        href: "/operational/attendance-log",
        icon: <HiUserGroup className="text-xl" />,
      },
    ],
  },
  {
    can: "show:cash-flow",
    icon: <HiOutlineCurrencyDollar className="text-xl" />,
    label: "Keuangan",
    key: "cash",
    children: [
      {
        can: "show:penerimaan-modal",
        label: "Penerimaan Modal",
        href: "/cash/penerimaan-modal",
        icon: <TbCashRegister className="text-xl" />,
      },
      {
        can: "show:kategori-biaya",
        label: "Kategori Biaya",
        href: "/cash/kategori-biaya",
        icon: <VscVariableGroup className="text-xl" />,
      },
      {
        can: "show:biaya",
        label: "Biaya",
        href: "/cash/biaya",
        icon: <FaMoneyBillAlt className="text-xl" />,
      },
      {
        can: "show:group-coa",
        label: "Group COA",
        href: "/cash/group-coa",
        icon: <HiOutlineListBullet className="text-xl" />,
      },
      {
        can: "show:coa",
        label: "COA",
        href: "/cash/coa",
        icon: <HiOutlineListBullet className="text-xl" />,
      },
      {
        can:"show:journal-type",
        label:"Journal Type",
        href:"/cash/journal-type",
        icon:<MdOutlineCollectionsBookmark className="text-xl" />
      },
      {
        can: "show:template-journal-and-detail",
        label: "Template Jurnal dan Detail",
        href: "/cash/template-journal",
        icon: <HiBookmark className="text-xl" />,
      },
      {
        can: "show:journal",
        label: "Jurnal",
        href: "/cash/journal",
        icon: <HiBookOpen  className="text-xl" />,
      },
      {
        can: "show:balance-sheet",
        label: "Neraca",
        href: "/cash/balance-sheet",
        icon: <FaBalanceScale className="text-xl" />,
      },
      {
        can: "show:profit-loss",
        label: "Profit & Loss",
        href: "/cash/profit-loss",
        icon: <GiMoneyStack className="text-xl" />,
      },
    ],
  },
  {
    can: "show:barang",
    icon: <FaBox className="text-xl" />,
    label: "Barang",
    key: "cash",
    children: [
      {
        can: "show:barang",
        label: "Barang",
        href: "/stock/good",
        icon: <TbAugmentedReality className="text-xl" />,
      },
      {
        can: "show:persediaan-barang",
        label: "Persediaan Barang",
        href: "/stock/persediaan-barang",
        icon: <TbBasketDown className="text-xl" />,
      },
      {
        can: "show:kartu-stok",
        label: "Kartu Stok Pakan Obat",
        href: "/stock/transaksi",
        icon: <TbBuildingWarehouse className="text-xl" />,
      },
    ],
  },
  {
    key: "master",
    can: "show:master",
    icon: <HiOutlineDatabase className="text-xl" />,
    label: "Data Master",
    children: [
      {
        can: "show:positions",
        label: "Jabatan",
        href: "/master/positions",
        icon: <HiOutlineUsers className="text-xl" />,
      },
      {
        can: "show:users",
        label: "Pengguna",
        href: "/master/users",
        icon: <HiOutlineUsers className="text-xl" />,
      },
      {
        can: "show:sites",
        label: "Lokasi",
        href: "/master/site",
        icon: <HiOutlineLocationMarker className="text-xl" />,
      },
      {
        can: "show:investors",
        label: "Investor",
        href: "/master/investors",
        icon: <HiOutlineUserPlus className="text-xl" />,
      },
      {
        can: "show:prices",
        label: "Harga",
        href: "/master/prices",
        icon: <HiOutlineBars3 className="text-xl" />,
      },
      {
        can: "show:roles",
        label: "Role",
        href: "/master/roles",
        icon: <HiOutlineRocketLaunch className="text-xl" />,
      },
      {
        can: "show:permissions",
        label: "Permission",
        href: "/master/permissions",
        icon: <HiOutlineCog6Tooth className="text-xl" />,
      },
    ],
  }
];