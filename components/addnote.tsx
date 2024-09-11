import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Link,
  Textarea,
} from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { PlusIcon } from "./icons";
import { addNote } from "@/utils/axios";

export default function AddNoteComponent({ ticketId }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      notes: "",
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const signupResponse = await addNote(ticketId, data);
      reset();
    } catch (error: any) {
      //setError(error.response?.data?.error || "Error Desconocido");
    }
  });

  return (
    <div>
      <Button
        size="sm"
        variant="shadow"
        isIconOnly
        color="primary"
        onPress={onOpen}
      >
        <PlusIcon height={"15px"} width={"15px"} />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <form onSubmit={onSubmit}>
              <ModalHeader className="flex flex-col gap-1">
                Agregar Nota
              </ModalHeader>
              <ModalBody>
                <Textarea
                  autoFocus
                  label="Nota"
                  placeholder="Se realizo chequeo de la linea de...."
                  variant="bordered"
                  type="text"
                  className="mb-2"
                  {...register("notes", {
                    required: "Agregar una nota es necesario!",
                  })}
                  errorMessage={errors.notes?.message}
                  isInvalid={!!errors.notes?.message}
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
    </div>
  );
}
