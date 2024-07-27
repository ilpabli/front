"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
  Input,
  Pagination,
} from "@nextui-org/react";
import Link from "next/link";
import UserComponent from "@/components/user";
import { EditIcon, DeleteIcon, SearchIcon, PlusIcon } from "./icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteUser } from "@/utils/axios";

const UsersComponent = ({ users, handleSetPage }: any) => {
  const MySwal = withReactContent(Swal);
  const [filterValue, setFilterValue] = React.useState("");

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue("");
  }, []);

  const handleDelete = (user: any) => {
    MySwal.fire({
      title: `Se eliminara el usuario ${user}`,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(user);
        MySwal.fire(`Se ha eliminado el cliente ${user}`);
      }
    });
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <Input
          isClearable
          className="w-full sm:max-w-[15%]"
          placeholder="Buscar por nombre"
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Link href={`/admin/users/create`}>
          <Button color="primary" variant="shadow" endContent={<PlusIcon />}>
            Añadir Usuario
          </Button>
        </Link>
      </div>
      <div>
        <span className="text-default-400 text-small">
          Total de usuarios: {users.totalDocs}
        </span>
      </div>
      <Table aria-label="Users">
        <TableHeader>
          <TableColumn className="text-center">NOMBRE Y APELLIDO</TableColumn>
          <TableColumn className="text-center">USUARIO</TableColumn>
          <TableColumn className="text-center">EMAIL</TableColumn>
          <TableColumn className="text-center">ROLE</TableColumn>
          <TableColumn className="text-center">ULTIMA CONEXIÓN</TableColumn>
          <TableColumn className="text-center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {users?.docs.map((user: any) => (
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
                <Tooltip
                  color="success"
                  content="Editar Usuario"
                  className="text-white"
                >
                  <span className="text-lg text-success cursor-pointer active:opacity-50 mx-2">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="success"
                    >
                      <Link href={`/admin/users/${user?.user}`}>
                        <EditIcon />
                      </Link>
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Borrar Usuario">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="danger"
                      onPress={() => handleDelete(user?.user)}
                    >
                      <DeleteIcon />
                    </Button>
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="py-2 px-2 flex justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={users?.page}
          total={users.totalPages}
          onChange={(page) => handleSetPage(page)}
        />
      </div>
    </div>
  );
};

export default UsersComponent;
