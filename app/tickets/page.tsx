"use client";
import React, { useEffect } from "react";
import { getTicketsfiltered, getTechnicians } from "../../utils/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import TicketsComponent from "@/components/tickets";
import io from "socket.io-client";
import LoadingComponent from "@/components/loading";

export default function Tickets() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`);
    socket.on("connect", () => {});
    socket.on("db-update", () => {
      queryClient.invalidateQueries({
        queryKey: ["tickets"],
        refetchType: "active",
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  const {
    isLoading,
    data: tickets,
    isError,
    error,
  } = useQuery({
    queryKey: ["tickets"],
    queryFn: getTicketsfiltered,
  });

  const { data: technicians, isLoading: isLoadingtechnicians } = useQuery({
    queryKey: ["technicians"],
    queryFn: getTechnicians,
  });

  if (isLoading || isLoadingtechnicians) return <LoadingComponent />;
  else if (isError) return <div>{error.message}</div>;
  return <TicketsComponent tickets={tickets} technicians={technicians} />;
}
