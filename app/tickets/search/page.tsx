"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import LoadingComponent from "@/components/loading";
import { getTicketsforSearch } from "@/utils/axios";
import TicketsSearchComponent from "@/components/ticketssearch";

export default function Tickets() {
  const queryClient = useQueryClient();
  const [query, setQuery] = useState<undefined>(undefined);

  const {
    isLoading,
    data: search,
    isError,
    error,
  } = useQuery({
    queryKey: ["search"],
    queryFn: getTicketsforSearch,
    refetchOnWindowFocus: false,
    staleTime: 1 * 60 * 1000,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );
  return <TicketsSearchComponent />;
}
