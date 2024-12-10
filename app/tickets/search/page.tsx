"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import LoadingComponent from "@/components/loading";
import { getTicketsforSearch, getClients, getTechnicians } from "@/utils/axios";
import TicketsSearchComponent from "@/components/ticketssearch";
import TicketSearchQueryComponent from "@/components/ticketssearchquery";

export default function Tickets() {
  const [query, setQuery] = useState<Object | null>(null);

  const {
    isLoading: isLoadingClients,
    data: clients,
    isError: isErrorClients,
    error: errorClients,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => getClients(),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  const {
    isLoading: isLoadingQuery,
    data: ticketsforquery,
    refetch,
  } = useQuery({
    queryKey: ["ticketsforquery"],
    queryFn: () => getTicketsforSearch(query),
    enabled: !!query,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  useEffect(() => {
    if (query) {
      refetch();
    }
  }, [query, refetch]);

  const { data: technicians, isLoading: isLoadingtechnicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => getTechnicians(undefined),
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoadingClients || isLoadingtechnicians || isLoadingQuery)
    return <LoadingComponent />;
  else if (isErrorClients)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {errorClients.message}
      </div>
    );
  return (
    <div>
      <TicketsSearchComponent
        clients={clients}
        technicians={technicians}
        setQuery={setQuery}
      />
      {ticketsforquery && (
        <TicketSearchQueryComponent tickets={ticketsforquery} />
      )}
    </div>
  );
}
