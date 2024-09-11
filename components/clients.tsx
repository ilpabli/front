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
import { EditIcon, DeleteIcon, SearchIcon, PlusIcon } from "./icons";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { deleteClient } from "@/utils/axios";
import { useRouter } from "next/navigation";

const ClientsComponent = ({
  clients,
  handleSetPage,
  handleSearchQuery,
}: any) => {
  const MySwal = withReactContent(Swal);
  const router = useRouter();
  const [filterValue, setFilterValue] = React.useState("");

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

  const handleDelete = (jobData: any) => {
    MySwal.fire({
      title: `Se eliminara el cliente numero ${jobData}`,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteClient(jobData);
        MySwal.fire(`Se ha eliminado el cliente ${jobData}`);
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-start">
        <Input
          isClearable
          className="w-full sm:max-w-[15%]"
          placeholder="Buscar por cliente"
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <Button
          color="primary"
          variant="shadow"
          endContent={<PlusIcon size={24} />}
          onPress={() => handleItemClick(`/admin/clients/create`)}
        >
          Añadir Cliente
        </Button>
      </div>
      <div>
        <span className="text-default-400 text-small">
          Total de clientes: {clients?.totalDocs}
        </span>
      </div>
      <Table aria-label="Clients">
        <TableHeader>
          <TableColumn className="text-center">CLIENTE</TableColumn>
          <TableColumn className="text-center">NUMERO</TableColumn>
          <TableColumn className="text-center">DIRECCIÓN</TableColumn>
          <TableColumn className="text-center">ACCIONES</TableColumn>
        </TableHeader>
        <TableBody>
          {clients?.docs.map((client: any) => (
            <TableRow key={client?._id}>
              <TableCell className="text-center">{client?.job_name}</TableCell>
              <TableCell className="text-center">
                {client?.job_number}
              </TableCell>
              <TableCell className="text-center">
                {client?.job_address}
              </TableCell>
              <TableCell className="text-center justify-center flex">
                <Tooltip
                  color="success"
                  content="Editar Cliente"
                  className="text-white"
                >
                  <span className="text-lg text-success cursor-pointer active:opacity-50 mx-2">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="success"
                      onPress={() =>
                        handleItemClick(`/admin/clients/${client?.job_number}`)
                      }
                    >
                      <EditIcon />
                    </Button>
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Borrar Cliente">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50">
                    <Button
                      size="sm"
                      variant="shadow"
                      isIconOnly
                      color="danger"
                      onPress={() => handleDelete(client?.job_number)}
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
      {clients?.totalDocs > 1 && (
        <div className="py-2 px-2 flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            loop={true}
            color="primary"
            page={clients?.page}
            total={clients?.totalPages}
            onChange={(page) => handleSetPage(page)}
          />
        </div>
      )}
    </div>
  );
};

export default ClientsComponent;
