import React, { useState, useEffect } from "react";
import { Input, Card, Button } from "@nextui-org/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { updateClient } from "@/utils/axios";

const EditClientComponent = ({ client, clientId }: any) => {
  const [error, setError] = useState<string | undefined>();
  const MySwal = withReactContent(Swal);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (client) {
      setValue("job_name", client?.job_name);
      setValue("job_number", client?.job_number);
      setValue("job_address", client?.job_address);
      setValue("gps_point.lat", client?.gps_point.lat);
      setValue("gps_point.lng", client?.gps_point.lng);
    }
  }, [client, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      const update = await updateClient(clientId, filteredData);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Cliente Actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      console.log(error);
      if (error) {
        return setError("Todos los valores son requeridos");
      }
      setError("Error Desconocido");
    }
  });

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      {client?.job_number && (
        <Card className="bg-neutral-950 px-8 py-10">
          <form onSubmit={onSubmit} className="flex flex-col items-center">
            {error && (
              <div className="bg-red-500 text-white p-2 mb-2 w-full">
                {error}
              </div>
            )}
            <h1 className="text-4xl font-bold mb-7 text-center">
              {client?.job_name} - {clientId}
            </h1>
            <Input
              type="text"
              label="Nombre"
              placeholder="Nombre..."
              {...register("job_name")}
              className="max-w-xs mb-2"
            />
            <Input
              type="text"
              label="Numero"
              placeholder="Obra..."
              className="max-w-xs mb-2"
              {...register("job_number")}
            />
            <Input
              type="text"
              label="Direccion"
              placeholder="Av Belgrano 884..."
              className="max-w-xs mb-2"
              {...register("job_address")}
            />
            <Input
              type="Number"
              label="Latitud"
              placeholder=""
              className="max-w-xs mb-2"
              {...register("gps_point.lat")}
            />
            <Input
              type="Number"
              label="Longitud"
              placeholder=""
              className="max-w-xs mb-2"
              {...register("gps_point.lng")}
            />
            <Button
              type="submit"
              color="danger"
              variant="shadow"
              className="max-w-xs mb-2"
            >
              Guardar
            </Button>
          </form>
          <Link href="/admin/clients" className="flex justify-center">
            <Button
              type="submit"
              color="primary"
              variant="shadow"
              className="max-w-xs mt-2"
            >
              Atras
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default EditClientComponent;
