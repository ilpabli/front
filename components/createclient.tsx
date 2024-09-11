"use client";
import React, { useEffect, useState } from "react";
import { Input, Card, Button } from "@nextui-org/react";
import { createClient } from "@/utils/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

const CreateClientComponent = () => {
  const [error, setError] = useState<string | undefined>();
  const MySwal = withReactContent(Swal);
  const router = useRouter();

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
    formState: { errors },
  } = useForm({
    defaultValues: {
      job_number: "",
      job_name: "",
      job_address: "",
      gps_point: { lat: "", lng: "" },
    },
  });

  const handleItemClick = (path: any) => {
    router.push(path);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const signupResponse = await createClient(data);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Cliente Creado",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
    } catch (error: any) {
      if (error) {
        setError(error.response?.data?.error || "Error Desconocido");
      } else {
        setError("Error Desconocido");
      }
    }
  });

  return (
    <div className="justify-center flex items-center">
      <Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={onSubmit} className="flex flex-col items-center">
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
            {...register("job_number", {
              required: "Numero?",
            })}
            errorMessage={errors?.job_number?.message}
            isInvalid={!!errors.job_number?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Nombre de la obra"
            placeholder="Ej: Pampa Energia"
            {...register("job_name", {
              required: "Nombre?",
            })}
            errorMessage={errors?.job_name?.message}
            isInvalid={!!errors.job_name?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Direccion de la obra"
            placeholder="Ej: Maipu 1"
            {...register("job_address", {
              required: "Dirección?",
            })}
            errorMessage={errors?.job_address?.message}
            isInvalid={!!errors.job_address?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="number"
            label="Latitud GPS"
            placeholder="Ej: -34.6079434"
            {...register("gps_point.lat", {
              required: "Latitud?",
              valueAsNumber: true,
              validate: (value: any) => !isNaN(value) || "Debe ser un número",
            })}
            errorMessage={errors?.gps_point?.lat?.message}
            isInvalid={!!errors.gps_point?.lat?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="number"
            label="Longitud GPS"
            placeholder="Ej: -58.3787982"
            {...register("gps_point.lng", {
              required: "Longitud?",
              valueAsNumber: true,
              validate: (value: any) => !isNaN(value) || "Debe ser un número",
            })}
            errorMessage={errors?.gps_point?.lng?.message}
            isInvalid={!!errors.gps_point?.lng?.message}
            className="max-w-xs mb-2"
          />
          <Button
            type="submit"
            color="success"
            className="mb-2 text-white"
            variant="shadow"
          >
            Generar
          </Button>
        </form>
        <div className="flex justify-center">
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            className="max-w-xs"
            onPress={() => handleItemClick(`/admin/clients`)}
          >
            Atras
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default CreateClientComponent;
