"use client";
import React, { useEffect, useState } from "react";
import {
  Select,
  SelectItem,
  Input,
  Textarea,
  Card,
  Button,
  Checkbox,
} from "@nextui-org/react";
import { createTicket } from "@/utils/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm, Controller } from "react-hook-form";
import { useSocket } from "@/contexts/socketContext";

interface CreateTicketComponent {
  clients: any;
}

const CreateTicketComponent: React.FC<CreateTicketComponent> = ({
  clients,
}) => {
  const [error, setError] = useState<string | undefined>();
  const MySwal = withReactContent(Swal);
  const { socket } = useSocket();
  const [jobDataValue, setJobDataValue] = useState(new Set<string>());
  const [eleEscValue, setEleEscValue] = useState(new Set<string>());

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      job_data: "",
      number_ele_esc: "",
      ele_esc: "",
      ticket_id: "",
      description: "",
      contact: "",
      priority: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const dataToSubmit = Object.entries(data).reduce(
        (acc, [key, value]) => {
          if (key !== "priority" || value !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, any>
      );
      const signupResponse = await createTicket(dataToSubmit);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Reclamo generado",
        showConfirmButton: false,
        timer: 1500,
      });
      if (dataToSubmit.priority) {
        socket?.emit("priorityStart", dataToSubmit);
      }
      reset();
      setJobDataValue(new Set<string>());
      setEleEscValue(new Set<string>());
    } catch (error: any) {
      if (error) {
        setError(error.response?.data?.error || "Error Desconocido");
      } else {
        setError("Error Desconocido");
      }
    }
  });

  const handlePriorityChange = (value: string) => {
    const currentPriority = watch("priority");
    setValue("priority", currentPriority === value ? "" : value);
    clearErrors("priority");
  };

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
          <Controller
            name="job_data"
            control={control}
            rules={{ required: "Obra?" }}
            render={({ field }) => (
              <Select
                label="Número de obra"
                placeholder="Seleccione"
                selectionMode="single"
                className="max-w-xs mb-2"
                selectedKeys={jobDataValue}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys as Set<string>)[0];
                  setJobDataValue(new Set([selectedValue]));
                  field.onChange(selectedValue);
                }}
                errorMessage={errors?.job_data?.message}
                isInvalid={!!errors.job_data?.message}
              >
                {clients?.map((job: any) => (
                  <SelectItem key={job.job_number} value={job.job_number}>
                    {job.job_number}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
          <Input
            type="text"
            label="Número de equipo"
            placeholder="Número..."
            className="max-w-xs mb-2"
            {...register("number_ele_esc", {
              required: "Equipo?",
            })}
            errorMessage={errors?.number_ele_esc?.message}
            isInvalid={!!errors.number_ele_esc?.message}
          />
          <Controller
            name="ele_esc"
            control={control}
            rules={{ required: "Tipo?" }}
            render={({ field }) => (
              <Select
                placeholder="Ascensor/Escalera"
                label="Tipo"
                selectionMode="single"
                className="max-w-xs mb-2"
                selectedKeys={eleEscValue}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys as Set<string>)[0];
                  setEleEscValue(new Set([selectedValue]));
                  field.onChange(selectedValue);
                }}
                errorMessage={errors?.ele_esc?.message}
                isInvalid={!!errors.ele_esc?.message}
              >
                <SelectItem key="Ascensor">Ascensor</SelectItem>
                <SelectItem key="Escalera">Escalera</SelectItem>
              </Select>
            )}
          />
          <Input
            type="text"
            label="Reclamo"
            placeholder="Número..."
            className="max-w-xs mb-2"
            {...register("ticket_id", { required: "No olvides el número." })}
            errorMessage={errors?.ticket_id?.message}
            isInvalid={!!errors.ticket_id?.message}
          />
          <Input
            type="text"
            label="Contacto"
            placeholder="Datos del informante..."
            className="max-w-xs mb-2"
            {...register("contact", {
              required: "Importante para la comunicación.",
            })}
            errorMessage={errors?.contact?.message}
            isInvalid={!!errors.contact?.message}
          />
          <Textarea
            label="Descripción"
            type="text"
            placeholder="El equipo se encuentra..."
            className="max-w-xs mb-2"
            {...register("description", {
              required: "Es necesario ingresar una descripción.",
            })}
            errorMessage={errors?.description?.message}
            isInvalid={!!errors.description?.message}
          />
          <div className="flex gap-4 mb-2">
            <Checkbox
              color="warning"
              isSelected={watch("priority") === "Gente Encerrada"}
              onChange={() => handlePriorityChange("Gente Encerrada")}
            >
              Gente Encerrada
            </Checkbox>
            <Checkbox
              color="danger"
              isSelected={watch("priority") === "Accidente"}
              onChange={() => handlePriorityChange("Accidente")}
            >
              Accidente
            </Checkbox>
          </div>
          <Button
            type="submit"
            color="success"
            className="mb-2 text-white"
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
