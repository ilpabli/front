"use client";
import {
  Map,
  AdvancedMarker,
  MapControl,
  ControlPosition,
} from "@vis.gl/react-google-maps";
import { useState, useEffect } from "react";
import { getTechnicians, getTicketspriority } from "../../utils/axios";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import { Button, Avatar } from "@nextui-org/react";
import { useSocket } from "@/contexts/socketContext";
import { MarkerWithInfoWindowComponent } from "@/components/MarkerWithInfoWindow";

interface LatLng {
  lat: number;
  lng: number;
}

function MapPage(): JSX.Element {
  const [center] = useState<LatLng>({ lat: -34.592814, lng: -58.4443 });
  const { socket } = useSocket();

  const {
    data: technicians,
    isLoading,
    error,
    isError,
    refetch: refetchTechnicians,
  } = useQuery({
    queryKey: ["technicians"],
    queryFn: () => getTechnicians(undefined),
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const {
    data: ticketsPriority,
    isLoading: isLoadingticketsPriority,
    refetch: refetchTicketsPriority,
  } = useQuery({
    queryKey: ["ticketsPriority"],
    queryFn: getTicketspriority,
    refetchOnWindowFocus: false,
    staleTime: 10 * 60 * 1000,
  });

  const sendGetLocation = (): void => {
    if (socket) {
      socket.emit("getLocation");
      setTimeout(() => {
        refetchTechnicians();
      }, 7000);
    } else {
      console.log("Socket not connected");
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("priorityAlert", () => {
        refetchTechnicians();
        refetchTicketsPriority();
      });
    }
    return () => {
      if (socket) {
        socket.off("priorityAlert");
      }
    };
  }, [socket]);

  if (isLoading || isLoadingticketsPriority) return <LoadingComponent />;
  else if (isError) return <div>{error.message}</div>;

  return (
    <div className="flex flex-col justify-center items-center h-[calc(90vh-4rem)]">
      <Map
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID}
        defaultZoom={13}
        defaultCenter={center}
      >
        <MapControl position={ControlPosition.RIGHT_TOP}>
          <Button
            size="lg"
            radius="full"
            className="mb-4 p-2"
            color="warning"
            onPress={sendGetLocation}
          >
            Buscar Tecnicos!
          </Button>
        </MapControl>
        {technicians &&
          technicians.map((tech: any, index: any) => (
            <AdvancedMarker
              key={index}
              position={{ lat: tech?.gps_point.lat, lng: tech?.gps_point.lng }}
              title={tech?.user}
            >
              <Avatar size="md" isBordered color="success" src={tech?.img} />
            </AdvancedMarker>
          ))}
        {ticketsPriority &&
          ticketsPriority.map((priority: any, index: any) => (
            <MarkerWithInfoWindowComponent key={index} data={priority} />
          ))}
      </Map>
    </div>
  );
}

export default MapPage;
