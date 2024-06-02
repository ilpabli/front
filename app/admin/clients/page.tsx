"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  Input,
  Card,
  Button,
} from "@nextui-org/react";

function ClientCreate() {

  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const createClientsResponse = await axios.post(
        `http://127.0.0.1:8080/api/clients`,
        {
          job_number: formData.get("job_number"),
          job_name: formData.get("job_name"),
          job_address: formData.get("job_address"),
          gps_point: {
            lat: formData.get("lat"),
            lng: formData.get("lng"),
          },
        }
      );
      router.push("/admin/");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2 w-full">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7 text-center">
            Creación de clientes
          </h1>
          <Input
            isRequired
            type="text"
            label="Numero de obra"
            placeholder="Ej: 004"
            name="job_number"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Nombre de la obra"
            placeholder="Ej: Pampa Energia"
            name="job_name"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Direccion de la obra"
            placeholder="Ej: Maipu 1"
            name="job_address"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="email"
            label="Latitud GPS"
            placeholder="Ej: -34.6079434"
            name="lat"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="password"
            label="Longitud GPS"
            placeholder="Ej: -58.3787982"
            name="lng"
            className="max-w-xs mb-2"
          />
          <Button type="submit" color="success" className="max-w-xs mb-2">
            Generar
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default ClientCreate;
