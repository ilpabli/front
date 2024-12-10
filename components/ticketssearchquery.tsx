"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@nextui-org/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { ExportAsExcel } from "react-export-table";
import { DownloadIcon } from "./icons";

const TicketSearchQueryComponent = ({ tickets }: any) => {
  const MySwal = withReactContent(Swal);
  const [totalTickets, setTotalTickets] = useState<number>(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (tickets) {
      const total = tickets.length;
      setTotalTickets(total);
    }
  }, [tickets]);

  const rowsPerPage = 10;
  const pages = Math.ceil(tickets.length / rowsPerPage);
  const ticketsFiltered = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return tickets.slice(start, end);
  }, [page, tickets]);

  const formattedTickets = tickets.map((ticket: any) => ({
    obra: `${ticket?.job_data?.job_number || ""} - ${ticket?.job_data?.job_name || ""}`,
    fecha: ticket?.ticket_createdAt || "",
    reclamo: `${ticket?.ticket_id || ""} - ${ticket?.ticket_status || ""}`,
    equipo: `${ticket?.ele_esc || ""} # ${ticket?.number_ele_esc || ""}`,
    estado: ticket?.status_ele_esc || "",
    prioridad: ticket?.priority || "",
    tecnico: `${ticket?.assigned_to?.first_name || ""} ${ticket?.assigned_to?.last_name || ""}`,
    horaAsignacion: ticket?.ticket_assignedAt || "",
    horaAtencion: ticket?.ticket_workingAt || "",
    horaCierre: ticket?.ticket_closedAt || "",
    solucion: ticket?.solution || "",
    ec: ticket?.ec || "",
    notas: Array.isArray(ticket?.notes) ? ticket.notes.join(", ") : "",
  }));

  return (
    <div className="flex flex-col gap-2">
      {totalTickets && (
        <div className="flex justify-between items-start">
          <span className="text-default-400 text-small">
            Total encontrado: {totalTickets}
          </span>
          <ExportAsExcel
            data={formattedTickets}
            fileName="ReporteTickets"
            name="Reporte"
            headers={[
              "OBRA",
              "FECHA",
              "RECLAMO",
              "EQUIPO",
              "ESTADO",
              "PRIORIDAD",
              "TÉCNICO",
              "HORA ASIGNACIÓN",
              "HORA ATENCIÓN",
              "HORA CIERRE",
              "SOLUCIÓN",
              "E/C",
              "NOTAS",
            ]}
          >
            {(props) => (
              <button {...props}>
                <DownloadIcon width="2em" height="2em" />
              </button>
            )}
          </ExportAsExcel>
        </div>
      )}
      <Table aria-label="TicketsSearchQuery">
        <TableHeader>
          <TableColumn className="text-center">OBRA</TableColumn>
          <TableColumn className="text-center">FECHA</TableColumn>
          <TableColumn className="text-center">RECLAMO</TableColumn>
          <TableColumn className="text-center">EQUIPO</TableColumn>
          <TableColumn className="text-center">ESTADO</TableColumn>
          <TableColumn className="text-center">PRIORIDAD</TableColumn>
          <TableColumn className="text-center">TÉCNICO</TableColumn>
          <TableColumn className="text-center">HORA ASIGNACIÓN</TableColumn>
          <TableColumn className="text-center">HORA ATENCIÓN</TableColumn>
          <TableColumn className="text-center">HORA CIERRE</TableColumn>
          <TableColumn className="text-center">SOLUCIÓN</TableColumn>
          <TableColumn className="text-center">E/C</TableColumn>
          <TableColumn className="text-center">NOTAS</TableColumn>
        </TableHeader>
        <TableBody>
          {ticketsFiltered?.map((ticket: any) => (
            <TableRow key={ticket?._id}>
              <TableCell className="text-center">{`${ticket?.job_data?.job_number} - ${ticket?.job_data?.job_name}`}</TableCell>
              <TableCell className="text-center">
                {ticket?.ticket_createdAt}
              </TableCell>
              <TableCell className="text-center">{`${ticket?.ticket_id} - ${ticket?.ticket_status}`}</TableCell>
              <TableCell className="text-center">
                {ticket?.ele_esc} # {ticket?.number_ele_esc}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.status_ele_esc}
              </TableCell>
              <TableCell className="text-center">{ticket?.priority}</TableCell>
              <TableCell className="text-center">
                {ticket?.assigned_to?.first_name}{" "}
                {ticket?.assigned_to?.last_name}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.ticket_assignedAt}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.ticket_workingAt}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.ticket_closedAt}
              </TableCell>
              <TableCell className="text-center">{ticket?.solution}</TableCell>
              <TableCell className="text-center">{ticket?.ec}</TableCell>
              <TableCell className="text-center">{ticket?.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalTickets > 1 && (
        <div className="py-2 px-2 flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            initialPage={1}
            loop={true}
            color="warning"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default TicketSearchQueryComponent;
