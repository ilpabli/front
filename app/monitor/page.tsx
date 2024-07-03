"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import { DangerIcon } from "./DangerIcon";
import io from "socket.io-client";
import TimeCounterComponent from "@/components/timecounter";
import TechnicianComponent from "@/components/technician";

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
    ticket_status: string;
    description: string;
    solution: string;
  }

  function getStatusClass(status: string) {
    switch (status) {
      case "Abierto":
        return "status-open";
      case "En proceso":
        return "status-in-process";
      case "Cerrado":
        return "status-closed";
      default:
        return "";
    }
  }
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);
    socket.on("connect", () => {
      console.log("Monitor Online!");
    });
    socket.on("tickets", (data) => {
      setTickets(data);
    });
    socket.on("db-update", (data) => {
      setTickets(data);
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className="text-center">OBRA</TableColumn>
        <TableColumn className="text-center">EQUIPO</TableColumn>
        <TableColumn className="text-center">RECLAMO</TableColumn>
        <TableColumn className="text-center">ESTADO</TableColumn>
        <TableColumn className="text-center">FECHA</TableColumn>
        <TableColumn className="text-center">ESTADO</TableColumn>
        <TableColumn className="text-center">ASIGNADO</TableColumn>
        <TableColumn className="text-center">DESCRIPCION</TableColumn>
        <TableColumn className="text-center">SOLUCION</TableColumn>
      </TableHeader>
      <TableBody className="text-center">
        {tickets.map((ticket) => (
          <TableRow key={ticket?.ticket_id}>
            <TableCell className="text-center">{`${ticket?.job_data.job_number} - ${ticket?.job_data.job_name}`}</TableCell>
            <TableCell className="text-center">
              {ticket?.ele_esc} # {ticket?.number_ele_esc}
            </TableCell>
            <TableCell className="text-center">{ticket?.ticket_id}</TableCell>
            <TableCell
              className={`text-center ${getStatusClass(ticket?.ticket_status)}`}
            >
              {ticket?.ticket_status}
            </TableCell>
            <TableCell className="text-center">
              {ticket?.ticket_createdAt}
              <TimeCounterComponent ticket={ticket} />
            </TableCell>
            <TableCell className="text-center">
              <Button
                color="danger"
                variant="bordered"
                startContent={
                  <DangerIcon
                    filled={true}
                    size="25"
                    height="24px"
                    width="24px"
                    label={ticket?.status_ele_esc}
                  />
                }
              >
                {ticket?.status_ele_esc}
              </Button>
            </TableCell>
            <TableCell className="text-center">
              {ticket?.assigned_to ? (
                <TechnicianComponent assigned_to={ticket?.assigned_to} />
              ) : (
                "Sin Asignar"
              )}
            </TableCell>
            <TableCell className="text-center">{ticket?.description}</TableCell>
            <TableCell className="text-center">{ticket?.solution}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
