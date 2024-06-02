"use client";
import { FormEvent, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import {
  Select,
  SelectItem,
  Input,
  Card,
  Button,
} from "@nextui-org/react";

function UserEdit() {
  interface User {
    _id: number;
    first_name: string;
    last_name: string;
    user: string;
    role: string;
    email: string;
  }
  const params = useParams();
  const router = useRouter();
  const { userId } = params;
  const [error, setError] = useState<string | undefined>();
  const [user, setUser] = useState<User>({
    _id: 0,
    first_name: "",
    last_name: "",
    user: "",
    role: "",
    email: "",
  });

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/api/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data));
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await axios.put(
        `http://127.0.0.1:8080/api/users/${userId}`,
        {
          first_name: formData.get("first_name"),
          last_name: formData.get("last_name"),
          user: formData.get("user"),
          role: formData.get("role"),
          email: formData.get("email"),
        }
      );
      router.push("/admin/users");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };
  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      {user.user && (<Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2 w-full">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7 text-center">
            Usuario {userId}
          </h1>
          <Input
            type="text"
            label="Nombre"
            placeholder="Nombre..."
            name="first_name"
            className="max-w-xs mb-2"
            value={user.first_name}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            label="Apellido"
            placeholder="Apellido..."
            name="last_name"
            className="max-w-xs mb-2"
            value={user.last_name}
            onChange={handleInputChange}
          />
          <Input
            type="text"
            label="Usuario"
            placeholder="Usuario..."
            name="user"
            className="max-w-xs mb-2"
            value={user.user}
            onChange={handleInputChange}
          />
          <Select
            placeholder="Puesto"
            label="Role"
            selectionMode="single"
            className="max-w-xs mb-2"
            name="ele_esc"
            value={user.role}
            onChange={handleInputChange}
          >
            <SelectItem key="user">Usuario</SelectItem>
            <SelectItem key="technician">Tecnico</SelectItem>
            <SelectItem key="supervisor">Supervisor</SelectItem>
            <SelectItem key="receptionist">Recepcionista</SelectItem>
          </Select>
          <Button type="submit" color="danger" className="max-w-xs mb-2">
            Guardar
          </Button>
        </form>
        <Link href="/admin/users" className="px-20">
        <Button type="submit" color="primary" className="max-w-xs mt-2">Atras</Button>
        </Link>
      </Card>)}
    </div>
  );
}

export default UserEdit;
