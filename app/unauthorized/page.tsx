import { Image, Card, CardBody } from "@nextui-org/react";

const Unauthorized = () => {
  return (
    <>
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        <Card>
          <CardBody className="text-center text-xl">
            <h1>No tiene acceso a esta seccion.</h1>
          </CardBody>
        </Card>
        <Image src="/tecky.png" width={300} height={300} alt="tecky" />
      </div>
    </>
  );
};

export default Unauthorized;
