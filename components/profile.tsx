"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Image,
  Input,
  Button,
  Checkbox,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { changePassword } from "@/utils/axios";

const ProfileComponent = ({ profile }: any) => {
  const [error, setError] = useState<String | undefined>("");
  const [selectChangePw, setSelectChangePw] = useState<Boolean | undefined>(
    false
  );
  const MySwal = withReactContent(Swal);
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const newPassword = watch("newPassword");

  const onSubmit = handleSubmit(async (data) => {
    try {
      const changePw = await changePassword(data);
      MySwal.fire({
        position: "top-end",
        icon: "success",
        title: "Contraseña modificada",
        showConfirmButton: false,
        timer: 1500,
      });
      reset;
    } catch (error: any) {
      setError(error.response.data.error);
    }
  });

  return (
    <div className="flex justify-center">
      <Card className="py-4">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
          <h1 className="font-bold text-large">
            {profile.first_name} {profile.last_name}
          </h1>
          <small className="text-default-500">{profile.email}</small>
          <small className="text-default-500">Role: {profile.role}</small>
        </CardHeader>
        <CardBody className="overflow-visible">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Image
              alt="profile photo"
              isBlurred
              className="object-cover rounded-xl"
              src={profile.img}
              width={250}
            />
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="text-center">
                <p>Usuario: {profile.user}</p>
                <p>Ultima conexión: {profile.last_connection}</p>
                {error && (
                  <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
                )}
                {!selectChangePw && (
                  <Checkbox
                    defaultSelected={false}
                    onValueChange={(isSelected: Boolean) =>
                      setSelectChangePw(isSelected)
                    }
                    color="primary"
                  >
                    Password
                  </Checkbox>
                )}
              </div>
              {selectChangePw && (
                <form
                  onSubmit={onSubmit}
                  className="flex flex-col items-center md:items-start gap-2 w-full max-w-xs"
                >
                  <Input
                    label="Contraseña actual"
                    placeholder="Ingrese su contraseña actual"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    size="sm"
                    className="w-full"
                    {...register("currentPassword", {
                      required: "Es necesario ingresar su contraseña actual.",
                    })}
                    errorMessage={errors?.currentPassword?.message}
                    isInvalid={!!errors.currentPassword}
                  />
                  <Input
                    label="Nueva contraseña"
                    placeholder="Ingrese su nueva contraseña"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    size="sm"
                    className="w-full"
                    {...register("newPassword", {
                      required: "Es necesario ingresar una nueva contraseña.",
                      minLength: {
                        value: 8,
                        message:
                          "La contraseña debe tener al menos 8 caracteres.",
                      },
                    })}
                    errorMessage={errors?.newPassword?.message}
                    isInvalid={!!errors.newPassword}
                  />
                  <Input
                    label="Confirmar nueva contraseña"
                    placeholder="Confirme su nueva contraseña"
                    endContent={
                      <button
                        className="focus:outline-none"
                        type="button"
                        onClick={toggleVisibility}
                      >
                        {isVisible ? <EyeSlashFilledIcon /> : <EyeFilledIcon />}
                      </button>
                    }
                    type={isVisible ? "text" : "password"}
                    size="sm"
                    className="w-full"
                    {...register("confirmNewPassword", {
                      required: "Es necesario confirmar la nueva contraseña.",
                      validate: (value) =>
                        value === newPassword ||
                        "Las contraseñas no coinciden.",
                    })}
                    errorMessage={errors?.confirmNewPassword?.message}
                    isInvalid={!!errors.confirmNewPassword}
                  />
                  <Button
                    type="submit"
                    color="primary"
                    size="sm"
                    className="w-full"
                  >
                    Cambiar contraseña
                  </Button>
                </form>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProfileComponent;
