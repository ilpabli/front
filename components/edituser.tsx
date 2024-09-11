import React, { useState, useEffect } from "react";
import { Input, Card, Button, Select, SelectItem } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { updateClient } from "@/utils/axios";
import { useRouter } from "next/navigation";

const EditUserComponent = ({ user, userId }: any) => {
  const [error, setError] = useState<string | undefined>();
  const MySwal = withReactContent(Swal);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (user) {
      setValue("first_name", user?.first_name);
      setValue("last_name", user?.last_name);
      setValue("user", user?.user);
      setValue("email", user?.email);
      setValue("role", user?.role);
    }
  }, [user, setValue]);

  const handleItemClick = (path: any) => {
    router.push(path);
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== "")
      );
      const update = await updateClient(userId, filteredData);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Usuario Actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error: any) {
      console.log(error);
      if (error) {
        return setError("Todos los valores son requeridos");
      }
      setError("Error Desconocido");
    }
  });

  return (
    <div className="justify-center flex items-center">
      {user?.user && (
        <Card className="bg-neutral-950 px-8 py-10">
          <form onSubmit={onSubmit} className="flex flex-col items-center">
            {error && (
              <div className="bg-red-500 text-white p-2 mb-2 w-full">
                {error}
              </div>
            )}
            <h1 className="text-4xl font-bold mb-7 text-center">
              Usuario {userId}
            </h1>
            <Input
              type="text"
              label="Nombre"
              placeholder="Nombre..."
              {...register("first_name")}
              className="max-w-xs mb-2"
            />
            <Input
              type="text"
              label="Apellido"
              placeholder="Apellido..."
              className="max-w-xs mb-2"
              {...register("last_name")}
            />
            <Input
              type="text"
              label="Usuario"
              placeholder="Usuario..."
              className="max-w-xs mb-2"
              {...register("user")}
            />
            <Select
              placeholder="Puesto"
              label="Role"
              selectionMode="single"
              className="max-w-xs mb-2"
              name="ele_esc"
              defaultSelectedKeys={[`${user.role}`]}
            >
              <SelectItem key="user">Usuario</SelectItem>
              <SelectItem key="technician">Tecnico</SelectItem>
              <SelectItem key="supervisor">Supervisor</SelectItem>
              <SelectItem key="receptionist">Recepcionista</SelectItem>
            </Select>
            <Button
              type="submit"
              color="danger"
              variant="shadow"
              className="max-w-xs mb-2"
            >
              Guardar
            </Button>
          </form>
          <div className="flex justify-center">
            <Button
              type="submit"
              color="primary"
              variant="shadow"
              className="max-w-xs"
              onPress={() => handleItemClick(`/admin/users`)}
            >
              Atras
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EditUserComponent;
