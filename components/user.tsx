import React from "react";
import { User } from "@nextui-org/react";

export default function UserComponent({ user }: any) {
  return (
    <User
      name={`${user.full_name}`}
      description={user.role}
      avatarProps={{
        src: `${user.img}`,
      }}
    />
  );
}
