"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input, Card, Button } from "@nextui-org/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { EyeFilledIcon, EyeSlashFilledIcon } from "@/components/icons";
import { useRouter } from "next/navigation";

function Signin() {
  const [error, setError] = useState<String | undefined>("");
  const router = useRouter();
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

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(undefined);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        user: data.user,
        password: data.password,
      });
      if (res?.error) setError(res.error as string);
      if (res?.ok) return router.push("/tickets");
    } catch (error: any) {
      setError(error.message);
    }
  });

  return (
    <div className="flex flex-row justify-center items-center min-h-screen">
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
