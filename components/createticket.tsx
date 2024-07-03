"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Input,
  Textarea,
  Card,
  Button,
} from "@nextui-org/react";
import { createTicket } from "@/utils/axios";
import { useForm } from "react-hook-form";

interface CreateTicketComponent {
  clients: any;
}

const CreateTicketComponent: React.FC<CreateTicketComponent> = ({
  clients,
}) => {
  const [error, setError] = useState<string | undefined>();
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const signupResponse = await createTicket(data);
    } catch (error: any) {
      if (error) {
        return setError("Todos los valores son requeridos");
      }
      setError("Error Desconocido");
    }
  });

  return (
    <div className="justify-center h-[calc(80vh-4rem)] flex items-center">
      <Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2 rounded">
              {error}
            </div>
          )}
          <h1 className="text-4xl font-bold mb-7 text-center">
            Creación de reclamos
          </h1>
          <Select
            label="Numero de obra"
            placeholder="Seleccione"
            selectionMode="single"
            className="max-w-xs mb-2"
            {...register("job_data")}
          >
            {clients?.map((job: any) => (
              <SelectItem key={job.job_number}>{job.job_number}</SelectItem>
            ))}
          </Select>
          <Input
            type="text"
            label="Numero de equipo"
            placeholder="Numero..."
            {...register("number_ele_esc")}
            className="max-w-xs mb-2"
          />
          <Select
            placeholder="Ascensor/Escalera"
            label="Tipo"
            selectionMode="single"
            className="max-w-xs mb-2"
            {...register("ele_esc")}
          >
            <SelectItem key="Ascensor">Ascensor</SelectItem>
            <SelectItem key="Escalera">Escalera</SelectItem>
          </Select>
          <Input
            type="text"
            label="Reclamo"
            placeholder="Numero..."
            {...register("ticket_id")}
            className="max-w-xs mb-2"
          />
          <Textarea
            label="Descripcion"
            type="text"
            placeholder="El equipo se encuentra..."
            {...register("description")}
            className="max-w-xs mb-2"
          />
          <Button
            type="submit"
            color="success"
            className="max-w-xs mb-2 text-white"
            variant="shadow"
          >
            Generar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateTicketComponent;
