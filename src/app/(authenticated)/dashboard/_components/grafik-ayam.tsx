import {Card, CardBody, CardHeader, Spinner} from "@nextui-org/react";
import {TimePeriodSelector} from "@/app/(authenticated)/dashboard/_components/time-period-selector";
import dynamic from "next/dynamic";

const Chart = dynamic(
  () => import("react-apexcharts").then((mod) => mod.default),
  { ssr: false, loading: () => <Spinner /> }
);
export default function GrafikAyam (){
  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "line",
      height: 350,
      toolbar: { show: false },
    },
    colors: ["#1B693E", "#F6C344"],
    markers: {
      size: 6,
      hover: { sizeOffset: 3 },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 },
    xaxis: {
      categories: [
        "1 Oct", "3 Oct", "7 Oct", "10 Oct", "14 Oct", "20 Oct", "23 Oct", "27 Oct", "30 Oct",
      ],
    },
    yaxis: {
      title: { text: "Jumlah (Ribu / Bulanan)" },
    },
    tooltip: {
      theme: "light",
      shared: false,
      intersect: true,
    },
  };

  const chartSeries = [
    {
      name: "DOC",
      data: [180, 250, 200, 280, 400, 150, 80, 180, 400],
    },
    {
      name: "Afkir",
      data: [0, 120, 140, 90, 300, 380, 300, 350, 200],
    },
  ];
  
    return (
        <div>
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold">Grafik</h2>
                  <p className="text-lg text-muted-foreground">Ayam</p>
                </div>
                <div className="flex">
                  <TimePeriodSelector
                    onChange={(value) => console.log("Selected:", value)}
                  />
                </div>
              </div>
              <div>
                <Chart options={chartOptions} series={chartSeries} type="line" height={350} />
              </div>
              <div className="p-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total DOC
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">25.000.000</div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Total Ayam Afkir
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">12.000.000</div>
                    </CardBody>
                  </Card>

                  <Card>
                    <CardHeader className="space-y-0 pb-0 d-flex flex-col">
                      <div className="text-sm font-medium">
                        Rasio
                      </div>
                    </CardHeader>
                    <CardBody className="d-flex flex-col items-center">
                      <div className="text-2xl font-bold text-primary">200</div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
    )
}