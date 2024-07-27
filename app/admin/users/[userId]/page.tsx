"use client";
import { useParams } from "next/navigation";
import { getUser } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";
import LoadingComponent from "@/components/loading";
import EditUserComponent from "@/components/edituser";

function UserEdit() {
  const params = useParams();
  const { userId } = params;
  const {
    isLoading,
    data: user,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUser(userId),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <LoadingComponent />;
  else if (isError)
    return (
      <div className="justify-center h-[calc(80vh-4rem)] flex flex-col items-center">
        {error.message}
      </div>
    );

  return <EditUserComponent user={user} userId={userId} />;
}

export default UserEdit;
