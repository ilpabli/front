"use client";
import { FormEvent, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import { Select, SelectItem, Input, Card, Button } from "@nextui-org/react";
import axiosInstance from "@/utils/axios";

function ClientEdit() {
  interface Client {
    _id: number;
    job_number: string;
    job_name: string;
    job_address: string;
    gps_point: {
      lat: string;
      lng: string;
    };
  }
  const params = useParams();
  const router = useRouter();
  const { clientId } = params;
  const [error, setError] = useState<string | undefined>();
  const [client, setClient] = useState<Client>({
    _id: 0,
    job_number: "",
    job_name: "",
    job_address: "",
    gps_point: {
      lat: "",
      lng: "",
    },
  });

  useEffect(() => {
    axiosInstance
      .get(`clients/${clientId}`)
      .then((response: any) => setClient(response.data))
      .catch((error: any) => console.error(error));
  }, [clientId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setClient((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await axiosInstance.put(`users/${clientId}`, {
        job_number: formData.get("job_number"),
        job_name: formData.get("job_name"),
        job_address: formData.get("job_address"),
        gps_point: {
          lat: formData.get("lat"),
          lng: formData.get("lng"),
        },
      });
      router.push("/admin/clients");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      {client.job_number && (
        <Card className="bg-neutral-950 px-8 py-10">
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            {error && (
              <div className="bg-red-500 text-white p-2 mb-2 w-full">
                {error}
              </div>
            )}
            <h1 className="text-4xl font-bold mb-7 text-center">
              {client.job_name} - {clientId}
            </h1>
            <Input
              type="text"
              label="Nombre"
              placeholder="Nombre..."
              name="job_name"
              className="max-w-xs mb-2"
              value={client.job_name}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              label="Numero"
              placeholder="Obra..."
              name="job_number"
              className="max-w-xs mb-2"
              value={client.job_number}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              label="Direccion"
              placeholder="Av Belgrano 884..."
              name="job_address"
              className="max-w-xs mb-2"
              value={client.job_address}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              label="Latitud"
              placeholder=""
              name="lat"
              className="max-w-xs mb-2"
              value={client.gps_point.lat}
              onChange={handleInputChange}
            />
            <Input
              type="text"
              label="Longitud"
              placeholder=""
              name="lng"
              className="max-w-xs mb-2"
              value={client.gps_point.lng}
              onChange={handleInputChange}
            />
            <Button type="submit" color="danger" className="max-w-xs mb-2">
              Guardar
            </Button>
          </form>
          <Link href="/admin/clients" className="px-20">
            <Button type="submit" color="primary" className="max-w-xs mt-2">
              Atras
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
}

export default ClientEdit;
