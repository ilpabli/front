"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getClients } from "@/utils/axios";
import CreateTicketComponent from "@/components/createticket";
import LoadingComponent from "@/components/loading";

function TicketCreate() {
  const queryClient = useQueryClient();
  const {
    isLoading,
    data: clients,
    isError,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError) return <div>{error.message}</div>;
  return <CreateTicketComponent clients={clients} />;
}

export default TicketCreate;
