import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Textarea,
  Link,
} from "@nextui-org/react";
import { MailIcon } from "./icons";
import { useSocket } from "@/contexts/socketContext";
import { useForm } from "react-hook-form";

export default function MessageComponent() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { socket } = useSocket();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      socket?.emit("notificationStart", data);
      reset();
    } catch (error: any) {
      //setError(error.response?.data?.error || "Error Desconocido");
    }
  });

  return (
    <>
      <Link
        onPress={onOpen}
        underline="hover"
        className="text-warning cursor-pointer"
      >
        <MailIcon width="2em" height="2em" />
      </Link>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Enviar Mensaje
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Titulo"
                  placeholder="Llave perdida..."
                  variant="bordered"
                  type="text"
                  {...register("title", { required: "El titulo es requerido" })}
                  errorMessage={errors.title?.message}
                  isInvalid={!!errors.title?.message}
                />
                <Textarea
                  autoFocus
                  label="Mensaje"
                  placeholder="Llamo el cliente..."
                  variant="bordered"
                  type="text"
                  className="mb-2"
                  {...register("body", { required: "El mensaje es requerido" })}
                  errorMessage={errors.body?.message}
                  isInvalid={!!errors.body?.message}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="shadow" onPress={onClose}>
                  Cancelar
                </Button>
                <Button color="primary" variant="shadow" type="submit">
                  Enviar
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
