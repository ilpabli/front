"use client";
import React, { useState, useEffect, useRef } from "react";
import LoadingComponent from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/utils/axios";
import UsersComponent from "@/components/users";

export default function Users() {
  const [pageQuery, setPageQuery] = useState<Number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<String | undefined>(undefined);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const {
    isLoading,
    data: users,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(pageQuery, searchQuery),
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
    if (pageQuery !== undefined) {
      refetch();
    }
  }, [pageQuery, refetch]);

  useEffect(() => {
    if (searchQuery !== undefined) {
      refetch();
    }
  }, [searchQuery, refetch]);

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );

  return (
    <UsersComponent
      users={users}
      handleSetPage={handleSetPage}
      handleSearchQuery={handleSearchQuery}
    />
  );
}
