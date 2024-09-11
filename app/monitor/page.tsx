"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Pagination,
} from "@nextui-org/react";
import { DangerIcon } from "@/components/icons";
import { useSocket } from "@/contexts/socketContext";
import TimeCounterComponent from "@/components/timecounter";
import TechnicianComponent from "@/components/technician";
import LoadingComponent from "@/components/loading";
import { useSession } from "next-auth/react";
import FsComponent from "@/components/fstoinservice";

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

  const { data: session } = useSession();

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
  const [page, setPage] = useState(1);
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

  const rowsPerPage = 8;
  const pages = Math.ceil(tickets.length / rowsPerPage);
  const ticketsFiltered = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return tickets.slice(start, end);
  }, [page, tickets]);

  useEffect(() => {
    if (pages > 1) {
      const interval = setInterval(() => {
        setPage((prevPage) => (prevPage < pages ? prevPage + 1 : 1));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [pages]);

  if (!tickets)
    return (
      <div>
        <LoadingComponent />
      </div>
    );

  return (
    <div>
      <Table aria-label="Monitor Table">
        <TableHeader>
          <TableColumn className="text-center text-white">OBRA</TableColumn>
          <TableColumn className="text-center text-white">EQUIPO</TableColumn>
          <TableColumn className="text-center text-white">RECLAMO</TableColumn>
          <TableColumn className="text-center text-white">FECHA</TableColumn>
          <TableColumn className="text-center text-white">ESTADO</TableColumn>
          <TableColumn className="text-center text-white">TÉCNICO</TableColumn>
          <TableColumn className="text-center text-white">
            DESCRIPCIÓN
          </TableColumn>
          <TableColumn className="text-center text-white">SOLUCIÓN</TableColumn>
        </TableHeader>
        <TableBody className="text-center">
          {ticketsFiltered.map((ticket) => (
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
                {session?.user?.role === "admin" ||
                session?.user?.role === "supervisor" ? (
                  <FsComponent ticket={ticket} />
                ) : (
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
                )}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.assigned_to ? (
                  <TechnicianComponent assigned_to={ticket?.assigned_to} />
                ) : (
                  "Sin Asignar"
                )}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.description}
              </TableCell>
              <TableCell className="text-center">{ticket?.solution}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pages > 1 && (
        <div className="py-2 px-2 flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            initialPage={1}
            loop={true}
            color="danger"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
}
