"use client";

import { useEffect, useState } from "react";
import LoadingOverlay from "./LoadingOverlay";

export default function InitialPageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  if (!isLoading) return null;

  return <LoadingOverlay />;
}
