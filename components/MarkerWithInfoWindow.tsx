import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from "@vis.gl/react-google-maps";
import { useState, useCallback } from "react";
import { SosIcon } from "./icons";

export const MarkerWithInfoWindowComponent = ({ data }: any) => {
  const [markerRef, marker] = useAdvancedMarkerRef();

  const [infoWindowShown, setInfoWindowShown] = useState(false);

  const handleMarkerClick = useCallback(
    () => setInfoWindowShown((isShown) => !isShown),
    []
  );
  const handleClose = useCallback(() => setInfoWindowShown(false), []);
  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{
          lat: Number(data?.job_data.gps_point.lat),
          lng: Number(data?.job_data.gps_point.lng),
        }}
        onClick={handleMarkerClick}
      >
        <SosIcon className="animate-bounce" size={35} />
      </AdvancedMarker>
      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          className="text-black font-bold"
          onClose={handleClose}
        >
          <h2>
            {data?.job_data.job_name} - {data?.job_data.job_address}
          </h2>
          <p>
            {data?.priority} - {data?.ele_esc} #{data?.number_ele_esc}
          </p>
          <p>
            {data?.contact} - {data?.ticket_createdAt}
          </p>
        </InfoWindow>
      )}
    </>
  );
};
