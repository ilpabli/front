"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input, Card, Button } from "@nextui-org/react";
import { useAuth } from "@/contexts/authContext";
import Image from "next/image";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";

function Signin() {
  const [error, setError] = useState("");
  const { login } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await login(data);
    } catch (error: any) {
      setError(error.message);
    }
  });

  return (
    <div className="flex flex-col justify-center items-center h-[calc(90vh-4rem)]">
      <Image
        priority={true}
        src="/tecky.png"
        width={300}
        height={300}
        alt="tecky"
      />
      <Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7">Login</h1>

          <Input
            type="text"
            label="Usuario"
            placeholder="Tecky"
            className="max-w-xs mb-2"
            isClearable
            variant="bordered"
            {...register("user", {
              required: "Usuario?",
            })}
            errorMessage={errors?.user?.message}
            isInvalid={!!errors.user?.message}
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
            variant="bordered"
            {...register("password", {
              required: "Es necesario ingresar su password.",
            })}
            errorMessage={errors?.password?.message}
            isInvalid={!!errors.password?.message}
          />

          <Button
            type="submit"
            variant="shadow"
            color="primary"
            className="bg-blue-500 text-white px-4 py-2 block w-full mt-4"
          >
            Ingresar
          </Button>
        </form>
      </Card>
    </div>
  );
}

export default Signin;
