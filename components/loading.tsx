import React from "react";
import { CircularProgress } from "@nextui-org/react";

export default function LoadingComponent() {
  return (
    <div className="flex gap-4 justify-center h-[calc(80vh-4rem)] items-center">
      <CircularProgress size="lg" color="primary" aria-label="Cargando..." />
    </div>
  );
}
