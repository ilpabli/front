"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axios";
import {
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

export default function Clients() {
  interface Client {
    _id: number;
    job_number: string;
    job_name: string;
    job_address: string;
  }
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    axiosInstance
      .get("/clients")
      .then((response: any) => setClients(response.data))
      .catch((error: any) => console.error(error));
  }, []);

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className="text-center">NOMBRE</TableColumn>
        <TableColumn className="text-center">NUMERO</TableColumn>
        <TableColumn className="text-center">DIRECCION</TableColumn>
        <TableColumn className="text-center">ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {clients.map((client) => (
          <TableRow key={client?._id}>
            <TableCell className="text-center">{client?.job_name}</TableCell>
            <TableCell className="text-center">{client?.job_number}</TableCell>
            <TableCell className="text-center">{client?.job_address}</TableCell>
            <TableCell className="text-center justify-center flex">
              <Tooltip content="Editar usuario">
                <span className="text-lg text-success-400 cursor-pointer active:opacity-50">
                  <Link href={`/admin/clients/${client?.job_number}`}>
                    <EditIcon />
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
