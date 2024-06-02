"use client";
import { FormEvent, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import {
  Select,
  SelectItem,
  Input,
  Textarea,
  Card,
  Button,
} from "@nextui-org/react";

function TicketEdit() {

  interface Technician {
    _id: number;
    first_name: string;
    last_name: string;
    user: string;
  }
  const params = useParams();
  const router = useRouter();
  const { ticketId } = params;
  const [error, setError] = useState<string | undefined>();
  const [ticketData, setTicketData] = useState({
    number_ele_esc: '',
    ele_esc: '',
    ticket_id: '',
    description: '',
    assigned_to: '',
  });
  const [technicians, setTechnicians] = useState<Technician[]>([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8080/api/tickets/${ticketId}`)
      .then((response) => response.json())
      .then((data) => setTicketData(data));
  }, [ticketId]);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/users/technicians")
      .then((response) => response.json())
      .then((data) => setTechnicians(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTicketData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const signupResponse = await axios.put(
        `http://127.0.0.1:8080/api/tickets/${ticketId}`,
        {
          ticket_id: Number(formData.get("ticket_id")),
          number_ele_esc: Number(formData.get("number_ele_esc")),
          description: formData.get("description"),
          ele_esc: formData.get("ele_esc"),
          assigned_to: formData.get("assigned_to"),
        }
      );
      router.push("/tickets");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="justify-center h-[calc(100vh-4rem)] flex items-center">
      {ticketData.ticket_id && (<Card className="bg-neutral-950 px-8 py-10">
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {error && (
            <div className="bg-red-500 text-white p-2 mb-2 w-full">{error}</div>
          )}
          <h1 className="text-4xl font-bold mb-7 text-center">
            Reclamo {ticketId}
          </h1>
          <Input
            type="text"
            label="Numero de equipo"
            placeholder="Numero..."
            name="number_ele_esc"
            className="max-w-xs mb-2"
            value={ticketData.number_ele_esc}
            onChange={handleInputChange}
          />
          <Select
            placeholder="Ascensor/Escalera"
            label="Tipo"
            selectionMode="single"
            className="max-w-xs mb-2"
            name="ele_esc"
            value={ticketData.ele_esc}
            onChange={handleInputChange}
          >
            <SelectItem key="Escalera">Escalera</SelectItem>
            <SelectItem key="Ascensor">Ascensor</SelectItem>
          </Select>
          <Select
            label="Asignado a"
            placeholder="Seleccione"
            selectionMode="single"
            className="max-w-xs mb-2"
            value={ticketData.assigned_to}
            onChange={handleInputChange}
            name="assigned_to"
                >
                  {technicians.map((technician) => (
                    <SelectItem key={technician.user} value={technician.user}>
                      {technician.user}
                    </SelectItem>
                  ))}
                </Select>
          <Input
            type="text"
            label="Reclamo"
            placeholder="Numero..."
            name="ticket_id"
            className="max-w-xs mb-2"
            value={ticketData.ticket_id}
            onChange={handleInputChange}
          />
          <Textarea
            label="Descripcion"
            type="text"
            placeholder="El equipo se encuentra..."
            name="description"
            className="max-w-xs mb-2"
            value={ticketData.description}
            onChange={handleInputChange}
          />
          <Button type="submit" color="danger" className="max-w-xs mb-2">
            Guardar
          </Button>
        </form>
        <Link href="/tickets" className="px-20">
        <Button type="submit" color="primary" className="max-w-xs mt-2">Atras</Button>
        </Link>
      </Card>)}
    </div>
  );
}

export default TicketEdit;
