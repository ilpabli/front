"use client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { RefreshIcon, EditIcon, DeleteIcon } from "./icons";
import { setTechnician, deleteTicket, refreshAssign } from "../utils/axios";
import TimeCounterComponent from "./timecounter";
import DescriptionComponent from "./description";
import { useSession } from "next-auth/react";
import TechnicianComponent from "./technician";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { VerticalDotsIcon } from "./icons";
import MessageComponent from "./message";
import LastTechnicianComponent from "./lasttechnician";
import { useRouter } from "next/navigation";
import AddNoteComponent from "./addnote";

interface TicketsComponentProps {
  tickets: any;
  technicians: any;
  setTime: any;
}

const TicketsComponent: React.FC<TicketsComponentProps> = ({
  tickets,
  technicians,
  setTime,
}) => {
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const { data: session, status } = useSession();
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

  const handleItemClick = (path: any) => {
    router.push(path);
  };

  const handleDelete = (id: any) => {
    MySwal.fire({
      title: `Se eliminara el reclamo numero ${id}`,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTicket(id);
        MySwal.fire(`Se ha eliminado el reclamo ${id}`);
      }
    });
  };
  const handleRefresh = (ticketId: any, user: any) => {
    MySwal.fire({
      title: `Se eliminara a ${user} del reclamo`,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        refreshAssign(ticketId);
        MySwal.fire(`Se ha eliminado a ${user}`);
      }
    });
  };

  return (
    <div className="flex flex-col items-end">
      <div className="flex justify-between gap-3 items-end">
        <MessageComponent />
      </div>
      <Table aria-label="Tickets Table">
        <TableHeader>
          <TableColumn className="text-center text-white">OBRA</TableColumn>
          <TableColumn className="text-center text-white">FECHA</TableColumn>
          <TableColumn className="text-center text-white">RECLAMO</TableColumn>
          <TableColumn className="text-center text-white">EQUIPO</TableColumn>
          <TableColumn className="text-center text-white">ESTADO</TableColumn>
          <TableColumn className="text-center text-white flex justify-center items-center">
            <div>TÉCNICO</div>
            <Dropdown>
              <DropdownTrigger>
                <div className="cursor-pointer">
                  <VerticalDotsIcon />
                </div>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={true}
                selectionMode="single"
              >
                <DropdownItem
                  key={3}
                  className="capitalize"
                  onPress={() => setTime(3)}
                >
                  3 Horas
                </DropdownItem>
                <DropdownItem
                  key={6}
                  className="capitalize"
                  onPress={() => setTime(6)}
                >
                  6 Horas
                </DropdownItem>
                <DropdownItem
                  key={24}
                  className="capitalize"
                  onPress={() => setTime(24)}
                >
                  24 Horas
                </DropdownItem>
                <DropdownItem
                  key={0}
                  className="capitalize"
                  onPress={() => setTime("all")}
                >
                  Todos los tecnicos
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </TableColumn>
          <TableColumn className="text-center text-white">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {tickets?.map((ticket: any) => (
            <TableRow key={ticket?.ticket_id}>
              <TableCell className="text-center">{`${ticket?.job_data.job_number} - ${ticket?.job_data.job_name}`}</TableCell>
              <TableCell className="text-center">
                <div>{ticket?.ticket_createdAt}</div>
                <TimeCounterComponent ticket={ticket} />
              </TableCell>
              <TableCell className="text-center">
                {`${ticket?.ticket_id} - ${ticket?.ticket_status}`}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  {ticket?.ele_esc} # {ticket?.number_ele_esc}
                  <DescriptionComponent ticket={ticket} />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div>{ticket?.status_ele_esc}</div>
                {ticket?.priority && (
                  <div className="text-white font-bold bg-red-800 p-1 rounded animate-pulse">
                    {ticket?.priority}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-center">
                {ticket?.assigned_to ? (
                  <TechnicianComponent assigned_to={ticket?.assigned_to} />
                ) : (
                  <Dropdown>
                    <DropdownTrigger>
                      <Button variant="flat">Técnicos</Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Asignar técnicos"
                      selectionMode="single"
                      emptyContent="Sin técnicos"
                      items={technicians}
                      classNames={{
                        list: "max-h-[400px] overflow-auto custom-scrollbar",
                      }}
                    >
                      {(item: any) => (
                        <DropdownItem
                          key={item?.user}
                          textValue={item.user}
                          onPress={() =>
                            handleSelectChange(ticket?.ticket_id, item.user)
                          }
                        >
                          <div className="flex gap-2 items-center">
                            <Avatar
                              alt={item.user}
                              className="flex-shrink-0"
                              size="md"
                              src={item.img}
                            />
                            <div className="flex flex-col">
                              <span className="text-small">{item.user}</span>
                            </div>
                          </div>
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>
                )}
              </TableCell>
              <TableCell className="flex justify-center items-center">
                {ticket?.assigned_to && (
                  <Tooltip
                    color="warning"
                    content="Reiniciar Asignacion"
                    className="text-white"
                  >
                    <span className="text-lg text-warning cursor-pointer active:opacity-50 mx-1">
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
                  color="primary"
                  content="Agregar Nota"
                  className="text-white"
                >
                  <span className="text-lg text-success cursor-pointer active:opacity-50">
                    <AddNoteComponent ticketId={ticket?.ticket_id} />
                  </span>
                </Tooltip>
                <Tooltip
                  color="success"
                  content="Editar Ticket"
                  className="text-white"
                >
                  <span className="text-lg text-success cursor-pointer active:opacity-50 mx-1">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="success"
                      onPress={() =>
                        handleItemClick(`/tickets/create/${ticket?.ticket_id}`)
                      }
                    >
                      <EditIcon />
                    </Button>
                  </span>
                </Tooltip>
                {session?.user?.role === "admin" && (
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
      <LastTechnicianComponent tickets={tickets} />
    </div>
  );
};

export default TicketsComponent;
