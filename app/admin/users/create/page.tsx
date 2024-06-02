"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import {
  Input,
  Card,
  Button,
  Select,
  SelectItem,
} from "@nextui-org/react";

function UserCreate() {

  const router = useRouter();
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const createUserResponse = await axios.post(
        `http://127.0.0.1:8080/api/users`,
        {
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          user: formData.get("user"),
          password: formData.get("password"),
          email: formData.get("email"),
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
            Creación de usuario
          </h1>
          <Input
            isRequired
            type="text"
            label="Nombre"
            placeholder="Ej: Carlos"
            name="first_name"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Apellido"
            placeholder="Ej: Gonzalez"
            name="last_name"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="text"
            label="Usuario"
            placeholder="******"
            name="password"
            className="max-w-xs mb-2"
          />
          <Input
            isRequired
            type="email"
            label="Correo electronico"
            placeholder="******"
            name="email"
            className="max-w-xs mb-2"
          />
          <Select
            placeholder="Puesto"
            label="Role"
            selectionMode="single"
            className="max-w-xs mb-2"
            name="role"
          >
            <SelectItem key="user">Usuario</SelectItem>
            <SelectItem key="technician">Tecnico</SelectItem>
            <SelectItem key="supervisor">Supervisor</SelectItem>
            <SelectItem key="receptionist">Recepcionista</SelectItem>
          </Select>
          <Input
            isRequired
            type="password"
            label="Contraseña"
            placeholder=""
            name="password"
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

export default UserCreate;
