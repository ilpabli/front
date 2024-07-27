"use client";
import { useParams } from "next/navigation";
import { getClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import EditClientComponent from "@/components/editclient";

function ClientEdit() {
  const params = useParams();
  const { clientId } = params;
  const {
    isLoading,
    data: client,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["client", clientId],
    queryFn: () => getClient(clientId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );

  return <EditClientComponent client={client} clientId={clientId} />;
}

export default ClientEdit;
