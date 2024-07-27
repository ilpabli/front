"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTicket } from "@/utils/axios";
import ModifyticketComponent from "@/components/modifyticket";
import LoadingComponent from "@/components/loading";

export default function TicketEdit() {
  const params = useParams();
  const { ticketId } = params;
  const {
    data: ticket,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ticket", ticketId],
    queryFn: () => getTicket(ticketId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError) return <div>{error.message}</div>;
  return <ModifyticketComponent ticket={ticket} ticketId={ticketId} />;
}
