import { Image } from "@nextui-org/react";

const Unauthorized = () => {
  return (
    <>
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
      <h1 className="text-large">No tiene acceso a esta seccion.</h1>
        <Image src="/tecky.png" width={300} height={300} alt="tecky" />
      </div>
    </>
  );
};

export default Unauthorized;
