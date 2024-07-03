import React, { useState, useEffect, useCallback } from "react";
import {
  parseISO,
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
} from "date-fns";

const TimeCounterComponent = ({ ticket }: any) => {
  const [timeDisplay, setTimeDisplay] = useState("");

  const calculateTimeAgo = useCallback(() => {
    const now = new Date();
    const gmtMinus3 = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const date = parseISO(ticket.ticket_date);

    const diffInMinutes = differenceInMinutes(gmtMinus3, date);

    if (diffInMinutes < 60) {
      setTimeDisplay(`${diffInMinutes} minutos`);
    } else {
      const diffInHours = differenceInHours(gmtMinus3, date);
      if (diffInHours < 24) {
        const remainingMinutes = diffInMinutes % 60;
        setTimeDisplay(`${diffInHours} hora y ${remainingMinutes} minutos`);
      } else {
        const diffInDays = differenceInDays(gmtMinus3, date);
        const remainingHours = diffInHours % 24;
        const remainingMinutes = diffInMinutes % 60;
        setTimeDisplay(
          `${diffInDays} dia ${remainingHours} hs y ${remainingMinutes} min`
        );
      }
    }
  }, [ticket]);

  useEffect(() => {
    calculateTimeAgo();
    const intervalId = setInterval(calculateTimeAgo, 60000);
    return () => clearInterval(intervalId);
  }, [calculateTimeAgo]);

  return <div>{timeDisplay}</div>;
};

export default TimeCounterComponent;
