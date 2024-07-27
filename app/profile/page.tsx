"use client";
import React from "react";
import LoadingComponent from "@/components/loading";
import { getProfile } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import ProfileComponent from "@/components/profile";

function Profile() {
  const {
    isLoading,
    data: profile,
    isError,
    error,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    refetchOnWindowFocus: false,
    staleTime: 60 * 60 * 1000,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );
  return <ProfileComponent profile={profile} />;
}
export default Profile;
