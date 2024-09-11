import React, { useState, useEffect } from "react";
import { parseISO, isValid } from "date-fns";

const LastTechnicianComponent = ({ tickets }: any) => {
  const [lastTechnician, setLastTechnician] = useState<any>(null);

  useEffect(() => {
    const getlastTechnician = (ticketArray: any) => {
      return ticketArray.reduce((mostRecent: any, current: any) => {
        if (!current.ticket_assignedAt) return mostRecent;

        const currentDate = parseISO(
          current.ticket_assignedAt.replace(" ", "T")
        );

        if (!isValid(currentDate)) return mostRecent;

        if (!mostRecent || !mostRecent.ticket_assignedAt) return current;

        const mostRecentDate = parseISO(
          mostRecent.ticket_assignedAt.replace(" ", "T")
        );

        return currentDate > mostRecentDate ? current : mostRecent;
      }, null);
    };

    if (tickets.length > 0) {
      const recentTicket = getlastTechnician(tickets);
      setLastTechnician(recentTicket);
    }
  }, [tickets]);
  if (!lastTechnician) {
    return null;
  }
  return <div>Ultima asignación: {lastTechnician?.assigned_to?.user}</div>;
};

export default LastTechnicianComponent;
