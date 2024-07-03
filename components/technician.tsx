import React from "react";
import { User } from "@nextui-org/react";

export default function TechnicianComponent({ assigned_to }: any) {
  return (
    <User
      name={`${assigned_to.first_name} ${assigned_to.last_name}`}
      description={assigned_to.user}
      avatarProps={{
        src: `${assigned_to.img}`,
        radius: "lg",
        size: "md",
        isBordered: true,
      }}
    />
  );
}
