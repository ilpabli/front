"use client";
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClientsPaginate } from "@/utils/axios";
import LoadingComponent from "@/components/loading";
import ClientsComponent from "@/components/clients";

export default function Clients() {
  const [pageQuery, setPageQuery] = useState<Number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<String | undefined>(undefined);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    isLoading,
    data: clients,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["clientsFiltered"],
    queryFn: () => getClientsPaginate(pageQuery, searchQuery),
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const handleSetPage = (page: number) => {
    setPageQuery(page);
  };

  const handleSearchQuery = (query: any) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setSearchQuery(query);
    }, 1000);
  };

  useEffect(() => {
    if (pageQuery) {
      refetch();
    }
    if (searchQuery || searchQuery == null) {
      refetch();
    }
  }, [pageQuery, refetch, searchQuery]);

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );

  return (
    <ClientsComponent
      clients={clients}
      handleSetPage={handleSetPage}
      handleSearchQuery={handleSearchQuery}
    />
  );
}
