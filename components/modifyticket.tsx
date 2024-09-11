"use client";
import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import {
  Select,
  SelectItem,
  Input,
  Textarea,
  Card,
  Button,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { updateTicket } from "@/utils/axios";
import { useRouter } from "next/navigation";

const ModifyticketComponent = ({ ticket, ticketId }: any) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (ticket) {
      setValue("number_ele_esc", ticket.number_ele_esc);
      setValue("ele_esc", ticket.ele_esc);
      setValue("status_ele_esc", ticket.status_ele_esc);
      setValue("ticket_id", ticket.ticket_id);
      setValue("description", ticket.description);
      setValue("solution", ticket.solution);
      setValue("rt", ticket.rt);
    }
  }, [ticket, setValue]);

  const handleItemClick = (path: any) => {
    router.push(path);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      const update = await updateTicket(ticketId, filteredData);
    } catch (error: any) {
      if (error) {
        return setError(error.response.data.error);
      }
      setError("Error Desconocido");
    }
  });

  return (
    <div className="justify-center flex items-center">
      {ticket.ticket_id && (
        <Card className="bg-neutral-950 px-8 py-10">
          <form onSubmit={onSubmit} className="flex flex-col items-center">
            {error && (
              <div className="bg-red-500 text-white p-2 mb-2 w-full">
                {error}
              </div>
            )}
            <h1 className="text-4xl font-bold mb-7 text-center">
              Reclamo {ticketId}
            </h1>
            <Input
              type="text"
              label="Numero de equipo"
              placeholder="Numero..."
              {...register("number_ele_esc")}
              className="max-w-xs mb-2"
            />
            <Select
              placeholder="Ascensor / Escalera"
              label="Tipo"
              selectionMode="single"
              className="max-w-xs mb-2"
              {...register("ele_esc")}
              defaultSelectedKeys={[`${ticket.ele_esc}`]}
            >
              <SelectItem key="Ascensor">Ascensor</SelectItem>
              <SelectItem key="Escalera">Escalera</SelectItem>
            </Select>
            <Select
              placeholder="Fuera de servicio / En servicio"
              label="Estado del equipo"
              selectionMode="single"
              className="max-w-xs mb-2"
              {...register("status_ele_esc")}
              defaultSelectedKeys={[`${ticket.status_ele_esc}`]}
            >
              <SelectItem key="Fuera de servicio">Fuera de servicio</SelectItem>
              <SelectItem key="En servicio">En servicio</SelectItem>
            </Select>
            <Input
              type="text"
              label="Reclamo"
              placeholder="Numero..."
              {...register("ticket_id")}
              className="max-w-xs mb-2"
            />
            <Textarea
              label="Descripción"
              type="text"
              placeholder="El equipo se encuentra..."
              {...register("description")}
              className="max-w-xs mb-2"
            />
            <Textarea
              label="Solución"
              type="text"
              placeholder="Se realizo..."
              {...register("solution")}
              className="max-w-xs mb-2"
            />
            <Input
              type="text"
              label="RT"
              placeholder="Numero de RT"
              {...register("rt")}
              className="max-w-xs mb-2"
            />
            <Button
              type="submit"
              color="danger"
              className="max-w-xs mb-2"
              variant="shadow"
            >
              Guardar
            </Button>
          </form>
          <div className="flex justify-center">
            <Button
              color="primary"
              className="max-w-xs mt-2"
              variant="shadow"
              onPress={() => handleItemClick(`/tickets`)}
            >
              Atras
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ModifyticketComponent;
