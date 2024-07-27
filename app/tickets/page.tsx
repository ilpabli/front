"use client";
import React, { useEffect, useState } from "react";
import { getTicketsfiltered, getTechnicians } from "../../utils/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TicketsComponent from "@/components/tickets";
import LoadingComponent from "@/components/loading";
import { useSocket } from "@/contexts/socketContext";

export default function Tickets() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [activeTechnicians, setActiveTechnicians] = useState(undefined);

  useEffect(() => {
    if (socket) {
      socket.on("db-update", () => {
        queryClient.invalidateQueries({
          queryKey: ["tickets"],
          refetchType: "active",
        });
      });
      socket.on("priorityAlert", (data) => {});
    }
    return () => {
      if (socket) {
        socket.off("db-update");
      }
    };
  }, [socket, queryClient]);

  const {
    isLoading,
    data: tickets,
    isError,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTicketsfiltered,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: technicians,
    isLoading: isLoadingtechnicians,
    refetch,
  } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => getTechnicians(activeTechnicians),
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const handleActiveTechnicians = (data: any) => {
    setActiveTechnicians(data);
  };

  useEffect(() => {
    if (activeTechnicians) {
      refetch();
    }
  }, [activeTechnicians, refetch]);

  if (isLoading || isLoadingtechnicians) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );
  return (
    <TicketsComponent
      tickets={tickets}
      technicians={technicians}
      setTime={handleActiveTechnicians}
    />
  );
}
