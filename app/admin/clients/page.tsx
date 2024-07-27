"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/utils/axios";
import LoadingComponent from "@/components/loading";
import ClientsComponent from "@/components/clients";

export default function Clients() {
  const [pageQuery, setPageQuery] = useState<Number>(1);
  const {
    isLoading,
    data: clients,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientsFiltered"],
    queryFn: () => getClients(pageQuery),
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const handleSetPage = (page: number) => {
    setPageQuery(page);
  };

  useEffect(() => {
    if (pageQuery) {
      refetch();
    }
  }, [pageQuery, refetch]);

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );

  return <ClientsComponent clients={clients} handleSetPage={handleSetPage} />;
}
