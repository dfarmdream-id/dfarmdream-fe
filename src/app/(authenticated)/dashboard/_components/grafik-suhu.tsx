import { Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";

export default function GrafikSuhu() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-col items-start">
          <div className="font-bold text-xl">Suhu Kandang</div>
        </CardHeader>
        <CardBody>
          Grafik Suhu Kandang
        </CardBody>
      </Card>
    </>
  );
}
