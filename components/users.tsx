"use client";
import React, { useState } from "react";
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
import UserComponent from "@/components/user";
import {
  EditIcon,
  DeleteIcon,
  SearchIcon,
  PlusIcon,
  RefreshIcon,
} from "./icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteUser, resetPassword } from "@/utils/axios";
import { useRouter } from "next/navigation";

const UsersComponent = ({ users, handleSetPage, handleSearchQuery }: any) => {
  const router = useRouter();
  const MySwal = withReactContent(Swal);
  const [filterValue, setFilterValue] = useState("");

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      handleSearchQuery(value);
    } else {
      setFilterValue("");
      handleSearchQuery(null);
    }
  }, []);

  const handleItemClick = (path: any) => {
    router.push(path);
  };

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

  const handleReset = (user: any) => {
    MySwal.fire({
      title: `Se restablecera la password a ${user.user}`,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        resetPassword(user);
        MySwal.fire(`Se ha restablecido la password a ${user.user}`);
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
        <Button
          color="primary"
          variant="shadow"
          endContent={<PlusIcon size={24} />}
          onPress={() => handleItemClick(`/admin/users/create`)}
        >
          Añadir Usuario
        </Button>
      </div>
      <div>
        <span className="text-default-400 text-small">
          Total de usuarios: {users?.totalDocs}
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
              <TableCell className="flex justify-center">
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
                  color="warning"
                  content="Resetear Password"
                  className="text-white"
                >
                  <span className="text-lg text-warning cursor-pointer active:opacity-50">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="warning"
                      onPress={() => handleReset({ user: user?.user })}
                    >
                      <RefreshIcon />
                    </Button>
                  </span>
                </Tooltip>
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
                      onPress={() =>
                        handleItemClick(`/admin/users/${user?.user}`)
                      }
                    >
                      <EditIcon />
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
      {users?.totalDocs > 1 && (
        <div className="py-2 px-2 flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            loop={true}
            color="primary"
            page={users?.page}
            total={users?.totalPages}
            onChange={(page) => handleSetPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default UsersComponent;
