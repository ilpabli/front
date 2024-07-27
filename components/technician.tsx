import React from "react";
import { Avatar } from "@nextui-org/react";

export default function TechnicianComponent({ assigned_to }: any) {
  return (
    <div className="flex justify-center items-center">
      <Avatar src={assigned_to.img} radius="lg" isBordered />
      <div className="flex flex-col mx-2">
        <div>{assigned_to.first_name}</div>
        <div>{assigned_to.last_name}</div>
      </div>
    </div>
  );
}
