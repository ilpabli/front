"use client";
import React from "react";
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
  Button,
  Avatar,
} from "@nextui-org/react";
import { DeleteIcon } from "./icons";
import { RefreshIcon } from "./icons";
import { EditIcon } from "./icons";
import Link from "next/link";
import { setTechnician, deleteTicket, refreshAssign } from "../utils/axios";
import { useAuth } from "@/contexts/authContext";
import { toast } from "sonner";
import TimeCounterComponent from "./timecounter";
import DescriptionComponent from "./description";
import TechnicianComponent from "./technician";

interface TicketsComponentProps {
  tickets: any;
  technicians: any;
}

const TicketsComponent: React.FC<TicketsComponentProps> = ({
  tickets,
  technicians,
}) => {
  const { user } = useAuth();
  const assignTechnician = async (ticketId: number, assignedTo: string) => {
    try {
      setTechnician(ticketId, assignedTo);
    } catch (error) {
      if (error) {
        console.log(error);
      }
    }
  };
  const handleSelectChange = (ticketId: number, assignedTo: string) => {
    assignTechnician(ticketId, assignedTo);
  };
  const handleDelete = (id: any) => {
    toast.error(`Se eliminara el reclamo numero ${id}`, {
      richColors: true,
      position: "top-center",
      duration: 5000,
      action: {
        label: "Eliminar!",
        onClick: () => deleteTicket(id),
      },
    });
  };
  const handleRefresh = (ticketId: any, user: any) => {
    toast.warning(`Se eliminara a ${user} del reclamo`, {
      position: "top-center",
      duration: 5000,
      richColors: true,
      action: {
        label: "Eliminar!",
        onClick: () =>
          toast.promise(refreshAssign(ticketId), {
            loading: "Refresh...",
            richColors: true,
            position: "top-center",
            success: () => {
              return `Asignacion eliminada`;
            },
            error: "Error",
          }),
      },
    });
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
        {tickets?.map((ticket: any) => (
          <TableRow key={ticket?.ticket_id}>
            <TableCell className="text-center">{`${ticket?.job_data.job_number} - ${ticket?.job_data.job_name}`}</TableCell>
            <TableCell className="text-center">
              {ticket?.ticket_createdAt}
              <TimeCounterComponent ticket={ticket} />
            </TableCell>
            <TableCell className="text-center">
              {ticket?.ticket_id} - {ticket?.ticket_status}
            </TableCell>
            <TableCell className="text-center">
              {ticket?.ele_esc} # {ticket?.number_ele_esc}
              <DescriptionComponent ticket={ticket} />
            </TableCell>
            <TableCell className="text-center">
              {ticket?.status_ele_esc}
            </TableCell>
            <TableCell className="text-center">
              {ticket?.assigned_to ? (
                <TechnicianComponent assigned_to={ticket?.assigned_to} />
              ) : (
                <Select
                  placeholder="Seleccione"
                  selectionMode="single"
                  className="max-w-xs text-center"
                  name="assigned_to"
                  aria-label="Asignar técnico"
                  onChange={(event) =>
                    handleSelectChange(ticket?.ticket_id, event.target.value)
                  }
                >
                  {technicians?.map((technician: any) => (
                    <SelectItem
                      key={technician.user}
                      textValue={technician.user}
                    >
                      <div className="flex gap-2 items-center">
                        <Avatar
                          alt={technician.user}
                          className="flex-shrink-0"
                          size="md"
                          src={technician.img}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">{technician.user}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </Select>
              )}
            </TableCell>
            <TableCell className="justify-center flex">
              {ticket?.assigned_to && (
                <Tooltip
                  color="warning"
                  content="Reiniciar Asignacion"
                  className="text-white"
                >
                  <span className="text-lg text-warning cursor-pointer active:opacity-50">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="warning"
                      onPress={() =>
                        handleRefresh(
                          ticket?.ticket_id,
                          ticket?.assigned_to.user
                        )
                      }
                    >
                      <RefreshIcon />
                    </Button>
                  </span>
                </Tooltip>
              )}
              <Tooltip
                color="success"
                content="Editar Ticket"
                className="text-white"
              >
                <span className="text-lg text-success cursor-pointer active:opacity-50 mx-2">
                  <Button size="sm" variant="shadow" isIconOnly color="success">
                    <Link href={`/tickets/create/${ticket?.ticket_id}`}>
                      <EditIcon />
                    </Link>
                  </Button>
                </span>
              </Tooltip>
              {user?.role === "admin" && (
                <Tooltip color="danger" content="Borrar Ticket">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="danger"
                      onPress={() => handleDelete(ticket?.ticket_id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </span>
                </Tooltip>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TicketsComponent;
