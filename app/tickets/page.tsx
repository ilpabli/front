"use client";
import React, { useState, useEffect } from "react";
import {
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";
import { EditIcon } from "./EditIcon";
import Link from "next/link";
import axios, { AxiosError } from "axios";

export default function Tickets() {
  interface Ticket {
    ticket_id: number;
    job_data: {
      job_name: string;
      job_number: string;
    };
    ticket_createdAt: string;
    ele_esc: string;
    number_ele_esc: number;
    status_ele_esc: string;
    assigned_to: string;
    acciones: string;
    ticket_status: string;
  }

  interface Technician {
    _id: number;
    first_name: string;
    last_name: string;
    user: string;
  }

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/tickets")
      .then((response) => response.json())
      .then((data) => setTickets(data));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/users/technicians")
      .then((response) => response.json())
      .then((data) => setTechnicians(data));
  }, []);

  const assignTechnician = async (ticketId: number, assignedTo: string) => {
    try {
      const assignTechnicianResponse = await axios.put(
        `http://127.0.0.1:8080/api/tickets/assing/${ticketId}`,
        {
          user: assignedTo,
        }
      );
      console.log(assignTechnicianResponse);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };

  const handleSelectChange = (ticketId: number, assignedTo: string) => {
    assignTechnician(ticketId, assignedTo);
  };

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className="text-center">OBRA</TableColumn>
        <TableColumn className="text-center">FECHA</TableColumn>
        <TableColumn className="text-center">RECLAMO</TableColumn>  
        <TableColumn className="text-center">EQUIPO</TableColumn>
        <TableColumn className="text-center">ESTADO</TableColumn>
        <TableColumn className="text-center">ASIGNADO</TableColumn>
        <TableColumn className="text-center">ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {tickets.map((ticket) => (
          <TableRow key={ticket?.ticket_id}>
            <TableCell className="text-center">{`${ticket?.job_data.job_number} - ${ticket?.job_data.job_name}`}</TableCell>
            <TableCell className="text-center">{ticket?.ticket_createdAt}</TableCell>
            <TableCell className="text-center">{ticket?.ticket_id} - {ticket?.ticket_status}</TableCell>  
            <TableCell className="text-center">{ticket?.ele_esc} # {ticket?.number_ele_esc}</TableCell>
            <TableCell className="text-center">{ticket?.status_ele_esc}</TableCell>
            <TableCell className="text-center">
              {ticket?.assigned_to ? (
                <span>{ticket?.assigned_to}</span>
              ) : (
                <Select 
                  placeholder="Seleccione"
                  selectionMode="single"
                  className="max-w-xs text-center"
                  name="assigned_to"
                  onChange={(event) =>
                    handleSelectChange(ticket?.ticket_id, event.target.value)
                  }
                >
                  {technicians.map((technician) => (
                    <SelectItem key={technician.user} value={technician.user}>
                      {technician.user}
                    </SelectItem>
                  ))}
                </Select>
              )}
            </TableCell>
            <TableCell className="text-center">
              <Tooltip content="Editar Ticket">
                <span className="text-lg text-success-400 cursor-pointer active:opacity-50">
                  <Link href={`/tickets/${ticket?.ticket_id}`}>
                    <EditIcon/>
                  </Link>
                </span>
              </Tooltip>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
