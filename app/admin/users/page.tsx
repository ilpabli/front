"use client";
import React, { useState, useEffect } from "react";
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
import axiosInstance from "@/utils/axios";
import UserComponent from "@/components/user";

export default function Users() {
  interface User {
    _id: number;
    full_name: string;
    user: string;
    email: string;
    role: string;
    last_connection: string;
  }
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    axiosInstance
      .get("/users")
      .then((response: any) => setUsers(response.data))
      .catch((error: any) => console.error(error));
  }, []);

  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn className="text-center">NOMBRE Y APELLIDO</TableColumn>
        <TableColumn className="text-center">USUARIO</TableColumn>
        <TableColumn className="text-center">EMAIL</TableColumn>
        <TableColumn className="text-center">ROLE</TableColumn>
        <TableColumn className="text-center">ULTIMA CONEXION</TableColumn>
        <TableColumn className="text-center">ACCIONES</TableColumn>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user?._id}>
            <TableCell className="text-center">
              <UserComponent user={user} />
            </TableCell>
            <TableCell className="text-center">{user?.user}</TableCell>
            <TableCell className="text-center">{user?.email}</TableCell>
            <TableCell className="text-center">{user?.role}</TableCell>
            <TableCell className="text-center">
              {user?.last_connection}
            </TableCell>
            <TableCell className="text-center justify-center flex">
              <Tooltip content="Editar usuario">
                <span className="text-lg text-success-400 cursor-pointer active:opacity-50">
                  <Link href={`/admin/users/${user?.user}`}>
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
