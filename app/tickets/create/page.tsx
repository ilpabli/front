"use client";
import { FormEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  Select,
  SelectItem,
  Input,
  Textarea,
  Card,
  Button,
} from "@nextui-org/react";
import useFetch from "@/components/useFetch";

function Signup() {
  const [error, setError] = useState<string | undefined>();
  const jobData = useFetch("http://127.0.0.1:8080/api/clients");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const signupResponse = await axios.post(
        `http://127.0.0.1:8080/api/tickets`,
        {
          ticket_id: Number(formData.get("ticket_id")),
          number_ele_esc: Number(formData.get("number_ele_esc")),
          description: formData.get("description"),
          job_data: formData.get("job_data"),
          ele_esc: formData.get("ele_esc"),
        }
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <Card className="bg-neutral-950 px-8 py-10 w-4/12">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2 w-full">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7 text-center">
            Creación de reclamos
          </h1>
          <Select
            label="Numero de obra"
            placeholder="Seleccione"
            selectionMode="single"
            className="max-w-xs mb-2"
            name="job_data"
          >
            {jobData.data
              ? jobData.data.map((job: any) => (
                  <SelectItem key={job.job_number}>{job.job_number}</SelectItem>
                ))
              : null}
          </Select>
          <Input
            type="text"
            label="Equipo"
            placeholder="Numero..."
            name="number_ele_esc"
            className="max-w-xs mb-2"
          />
          <Select
            placeholder="Ascensor/Escalera"
            label="Tipo"
            selectionMode="single"
            className="max-w-xs mb-2"
            name="ele_esc"
          >
            <SelectItem key="Escalator">Escalera</SelectItem>
            <SelectItem key="Elevator">Ascensor</SelectItem>
          </Select>
          <Input
            type="text"
            label="Reclamo"
            placeholder="Numero..."
            name="ticket_id"
            className="max-w-xs mb-2"
          />
          <Textarea
            label="Descripcion"
            type="text"
            placeholder="El equipo se encuentra..."
            name="description"
            className="max-w-xs mb-2"
          />
          <Button color="success" className="max-w-xs mb-2">
            Generar
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
