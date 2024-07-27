import React from "react";
import { User } from "@nextui-org/react";

export default function UserComponent({ user }: any) {
  return (
    <User
      name={`${user.first_name} ${user.last_name}`}
      description={user.role}
      avatarProps={{
        src: `${user.img}`,
      }}
    />
  );
}
