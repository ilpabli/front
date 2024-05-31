"use client";
import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Card } from "@nextui-org/react";

function Signin() {
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      user: formData.get("user"),
      password: formData.get("password"),
      redirect: false,
    });
    if (res?.error) setError(res.error as string);
    if (res?.ok) return router.push("/dashboard/profile");
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      <Card className="bg-neutral-950 px-8 py-10 w-4/12">
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

          <button
            color="primary"
            className="bg-blue-500 text-white px-4 py-2 block w-full mt-4"
          >
            Ingresar
          </button>
        </form>
      </Card>
    </div>
  );
}

export default Signin;
