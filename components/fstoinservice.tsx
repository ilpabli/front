import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Checkbox,
} from "@nextui-org/react";
import { DangerIcon } from "@/components/icons";
import { updateTicket } from "@/utils/axios";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export default function FsComponent({ ticket }: any) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [fs, setFs] = useState(false);
  const queryClient = useQueryClient();

  const fsMutation = useMutation({
    mutationFn: (ticketId: any) =>
      updateTicket(ticketId, { status_ele_esc: "En servicio" }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
        refetchType: "active",
      });
    },
  });

  const handleFs = (ticketId: any) => {
    fsMutation.mutate(ticketId);
  };

  const handleCheckboxChange = (event: any) => {
    setFs(event.target.checked);
  };

  useEffect(() => {
    return () => {
      setFs(false);
    };
  }, [isOpen]);

  return (
    <div className="mx-1">
      <Button color="danger" onPress={onOpen} startContent={<DangerIcon />}>
        <div className="text-white font-bold">
          {ticket?.status_ele_esc}
          {ticket?.priority &&
            (ticket?.ticket_status === "Abierto" ||
              ticket?.ticket_status === "En proceso") && (
              <div className="text-white font-bold animate-pulse">
                {ticket?.priority}
              </div>
            )}
        </div>
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Reclamo: {ticket.ticket_id}
              </ModalHeader>
              <ModalBody>
                <p>Contacto: {ticket?.contact}</p>
                <p>Descripción: {ticket?.description}</p>
                {ticket?.ec && <p key={ticket?.ec}>E/C: {ticket?.ec}</p>}
                {ticket?.notes &&
                  ticket.notes.map((note: any, index: any) => (
                    <p key={index}>
                      Nota{index + 1}: {note}
                    </p>
                  ))}
                {ticket.ticket_status === "Cerrado" && (
                  <Checkbox onChange={handleCheckboxChange} color="success">
                    Restablecer en servicio?
                  </Checkbox>
                )}
                {fs && (
                  <Button
                    color="success"
                    className="font-bold text-white"
                    variant="shadow"
                    onPress={() => handleFs(ticket.ticket_id)}
                  >
                    Confirmar En servicio!
                  </Button>
                )}
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
