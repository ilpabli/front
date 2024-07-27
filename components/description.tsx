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
} from "@nextui-org/react";
import { EyeIcon } from "./icons";

export default function DescriptionComponent({ ticket }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <div className="mx-1">
      <Link
        onPress={onOpen}
        underline="hover"
        className="text-success cursor-pointer"
      >
        <EyeIcon />
      </Link>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reclamo: {ticket.ticket_id}
              </ModalHeader>
              <ModalBody>
                <p>Contacto: {ticket?.contact}</p>
                <p>Descripción: {ticket.description}</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  className="font-bold"
                  variant="light"
                  onPress={onClose}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
