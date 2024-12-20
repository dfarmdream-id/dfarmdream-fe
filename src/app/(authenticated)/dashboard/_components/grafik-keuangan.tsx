"use client"

import {Card, CardBody, CardHeader, Select, SelectItem} from "@nextui-org/react";
import {useMemo, useState} from "react";
import {useGetJournalBalanceSheet} from "@/app/(authenticated)/_services/journal";
export default function GrafiKeuangan (){
  const [month, setMonth] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);

  const balanceSheets = useGetJournalBalanceSheet(
    useMemo(
      () => ({
        month: month || "0",
        year: year || "0",
      }),
      [year]
    )
  );

  const formatCurrency = (value: any) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };


  const kasDanSetaraKas = [101, 102];
  const persediaan = [121, 124, 125];
  const piutang = [141, 142];
  const assetTetap = [131, 132];
  const utangDagang = [201];
  const modal = [301];

  return (
        <div>
          <Card>
            <CardBody>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Analytics</h2>
                  <p className="text-lg text-muted-foreground">Keuangan</p>
                </div>
                <div>
                  <div className="flex gap-3" style={{
                    alignItems: "center",
                    width: "30rem",
                  }}>
                    <Select placeholder="Pilih Bulan"
                            variant="bordered"
                            labelPlacement="outside"
                            onChange={(e) => {
                              setMonth(e.target.value);
                            }}
                    >
                      <SelectItem key="1" value="1">January</SelectItem>
                      <SelectItem key="2" value="2">February</SelectItem>
                      <SelectItem key="3" value="3">March</SelectItem>
                      <SelectItem key="4" value="4">April</SelectItem>
                      <SelectItem key="5" value="5">May</SelectItem>
                      <SelectItem key="6" value="6">June</SelectItem>
                      <SelectItem key="7" value="7">July</SelectItem>
                      <SelectItem key="8" value="8">August</SelectItem>
                      <SelectItem key="9" value="9">September</SelectItem>
                      <SelectItem key="10" value="10">October</SelectItem>
                      <SelectItem key="11" value="11">November</SelectItem>
                      <SelectItem key="12" value="12">December</SelectItem>
                    </Select>
                    <Select placeholder="Pilih Tahun"
                            variant="bordered"
                            labelPlacement="outside"
                            onChange={(e) => {
                              setYear(e.target.value);
                            }}
                    >
                      <SelectItem key="2021" value="2021">2021</SelectItem>
                      <SelectItem key="2022" value="2022">2022</SelectItem>
                      <SelectItem key="2023" value="2023">2023</SelectItem>
                      <SelectItem key="2024" value="2024">2024</SelectItem>
                      <SelectItem key="2025" value="2025">2025</SelectItem>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Aset
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatCurrency(balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                            if (kasDanSetaraKas.includes(Number(balanceSheet.coa.code)) ||
                              persediaan.includes(Number(balanceSheet.coa.code)) ||
                              piutang.includes(Number(balanceSheet.coa.code)) ||
                              assetTetap.includes(Number(balanceSheet.coa.code))) {
                              return total + (balanceSheet._sum.debit - balanceSheet._sum.credit);
                            }
                            return total;
                          }, 0))
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">IDR</p>
                      {/*<p className="text-xs text-red-500 mt-1">*/}
                      {/*  -23.44%*/}
                      {/*</p>*/}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Kewajiban dan Ekuitas
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        {
                          formatCurrency(balanceSheets.data?.data?.trialBalance?.reduce((total, balanceSheet) => {
                            if (utangDagang.includes(Number(balanceSheet.coa.code)) ||
                              modal.includes(Number(balanceSheet.coa.code))) {
                              return total + (balanceSheet._sum.credit - balanceSheet._sum.debit);
                            }
                            return total;
                          }, 0))
                        }
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">IDR</p>
                      {/*<div className="flex items-baseline gap-2">*/}
                      {/*  <span className="text-xs text-red-500">-23.44%</span>*/}
                      {/*</div>*/}
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Laba Rugi
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">
                        Rp. 0
                      </div>
                      {/*<p className="text-xs text-red-500 mt-1">*/}
                      {/*  -23.44%*/}
                      {/*</p>*/}
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
    )
}