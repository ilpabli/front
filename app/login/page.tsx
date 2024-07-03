"use client";
import { FormEvent, useState } from "react";
import { Input, Card, Button } from "@nextui-org/react";
import { useAuth } from "@/contexts/authContext";
import Image from "next/image";

function Signin() {
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await login({
        user: formData.get("user"),
        password: formData.get("password"),
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

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
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7">Login</h1>

          <Input
            type="text"
            label="Usuario"
            placeholder="Tecky"
            className="max-w-xs mb-2"
            name="user"
          />

          <Input
            type="password"
            label="Password"
            placeholder="******"
            className="max-w-xs mb-2"
            name="password"
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
