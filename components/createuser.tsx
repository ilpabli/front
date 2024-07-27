"use client";
import React, { useEffect, useState } from "react";
import { Input, Card, Button, Select, SelectItem } from "@nextui-org/react";
import { createUser } from "@/utils/axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useForm, Controller } from "react-hook-form";
import Link from "next/link";
import { EyeFilledIcon, EyeSlashFilledIcon } from "./icons";

const CreateUserComponent = () => {
  const [error, setError] = useState<string | undefined>();
  const MySwal = withReactContent(Swal);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [role, setRole] = useState(new Set<string>());

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
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      user: "",
      password: "",
      email: "",
      role: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const signupResponse = await createUser(data);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Usuario Creado",
        showConfirmButton: false,
        timer: 1500,
      });
      reset();
      setRole(new Set<string>());
    } catch (error: any) {
      if (error) {
        setError(error.response?.data?.error || "Error Desconocido");
      } else {
        setError("Error Desconocido");
      }
    }
  });

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2 w-full">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7 text-center">
            Creación de usuario
          </h1>
          <Input
            isRequired
            type="text"
            label="Nombre"
            placeholder="Ej: Carlos"
            {...register("first_name", {
              required: "Nombre de pila",
            })}
            errorMessage={errors?.first_name?.message}
            isInvalid={!!errors.first_name?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Apellido"
            placeholder="Ej: Gonzalez"
            {...register("last_name", {
              required: "Apellido?",
            })}
            errorMessage={errors?.last_name?.message}
            isInvalid={!!errors.last_name?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Usuario"
            placeholder="******"
            {...register("user", {
              required: "Usuario?",
            })}
            errorMessage={errors?.user?.message}
            isInvalid={!!errors.user?.message}
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="email"
            label="Correo electronico"
            placeholder="******"
            {...register("email")}
            errorMessage={errors?.email?.message}
            isInvalid={!!errors.email?.message}
            className="max-w-xs mb-2"
          />
          <Controller
            name="role"
            control={control}
            rules={{ required: "Role?" }}
            render={({ field }) => (
              <Select
                placeholder="Puesto"
                label="Role"
                selectionMode="single"
                className="max-w-xs mb-2"
                selectedKeys={role}
                onSelectionChange={(keys) => {
                  const selectedValue = Array.from(keys as Set<string>)[0];
                  setRole(new Set([selectedValue]));
                  field.onChange(selectedValue);
                }}
                errorMessage={errors?.role?.message}
                isInvalid={!!errors.role?.message}
              >
                <SelectItem key="user">Usuario</SelectItem>
                <SelectItem key="technician">Tecnico</SelectItem>
                <SelectItem key="supervisor">Supervisor</SelectItem>
                <SelectItem key="receptionist">Recepcionista</SelectItem>
              </Select>
            )}
          />
          <Input
            label="Password"
            placeholder="******"
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon aria-hidden="true" />
                ) : (
                  <EyeFilledIcon aria-hidden="true" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
            className="max-w-xs mb-2"
            {...register("password", {
              required: "Es necesario ingresar su password.",
            })}
            errorMessage={errors?.password?.message}
            isInvalid={!!errors.password?.message}
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
        <Link href="/admin/users" className="flex justify-center">
          <Button
            type="submit"
            color="primary"
            variant="shadow"
            className="max-w-xs"
          >
            Atras
          </Button>
        </Link>
      </Card>
    </div>
  );
};

export default CreateUserComponent;
