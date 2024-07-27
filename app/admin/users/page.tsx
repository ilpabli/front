"use client";
import React, { useState, useEffect } from "react";
import LoadingComponent from "@/components/loading";
import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/utils/axios";
import UsersComponent from "@/components/users";

export default function Users() {
  const [pageQuery, setPageQuery] = useState<Number | undefined>(undefined);
  const {
    isLoading,
    data: users,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(pageQuery),
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

  return <UsersComponent users={users} handleSetPage={handleSetPage} />;
}
