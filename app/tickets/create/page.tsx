"use client";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/utils/axios";
import CreateTicketComponent from "@/components/createticket";
import LoadingComponent from "@/components/loading";

function TicketCreate() {
  const {
    isLoading,
    data: clients,
    isError,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );
  return <CreateTicketComponent clients={clients} />;
}

export default TicketCreate;
