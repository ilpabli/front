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
import { DangerIcon } from "@/components/icons";
import { useSocket } from "@/contexts/socketContext";
import TimeCounterComponent from "@/components/timecounter";
import TechnicianComponent from "@/components/technician";
import LoadingComponent from "@/components/loading";

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
    priority: string;
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
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit("getTickets");

      socket.on("db-update", (data) => {
        setTickets(data);
      });

      socket.on("tickets", (data) => {
        setTickets(data);
      });
    }
    return () => {
      if (socket) {
        socket.off("db-update");
        socket.off("tickets");
      }
    };
  }, [socket]);

  if (!tickets)
    return (
      <div>
        <LoadingComponent />
      </div>
    );

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className="text-center">OBRA</TableColumn>
        <TableColumn className="text-center">EQUIPO</TableColumn>
        <TableColumn className="text-center">RECLAMO</TableColumn>
        <TableColumn className="text-center">FECHA</TableColumn>
        <TableColumn className="text-center">ESTADO</TableColumn>
        <TableColumn className="text-center">TÉCNICO</TableColumn>
        <TableColumn className="text-center">DESCRIPCIÓN</TableColumn>
        <TableColumn className="text-center">SOLUCIÓN</TableColumn>
      </TableHeader>
      <TableBody className="text-center">
        {tickets.map((ticket) => (
          <TableRow key={ticket?.ticket_id}>
            <TableCell className="text-center">{`${ticket?.job_data.job_number} - ${ticket?.job_data.job_name}`}</TableCell>
            <TableCell className="text-center">
              {ticket?.ele_esc} # {ticket?.number_ele_esc}
            </TableCell>
            <TableCell className="text-center">
              <div>#{ticket?.ticket_id}</div>
              <div
                className={`text-center ${getStatusClass(ticket?.ticket_status)}`}
              >
                {ticket?.ticket_status}
              </div>
            </TableCell>
            <TableCell className="text-center">
              {ticket?.ticket_createdAt}
              <TimeCounterComponent ticket={ticket} />
            </TableCell>
            <TableCell className="text-center">
              <Button color="danger" startContent={<DangerIcon />}>
                <div className="text-white font-bold">
                  {ticket?.status_ele_esc}
                  {ticket?.priority &&
                    (ticket?.ticket_status === "Abierto" ||
                      ticket?.ticket_status === "En proceso") && (
                      <div className="text-white font-bold animate-pulse">
                        {ticket?.priority}
                      </div>
                    )}
                </div>
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
