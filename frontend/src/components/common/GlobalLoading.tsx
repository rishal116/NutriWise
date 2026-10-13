"use client";

import { useAppSelector } from "@/redux/hooks";
import LoadingOverlay from "./LoadingOverlay";

export default function GlobalLoading() {
  const isLoading = useAppSelector((state) => state.ui.isLoading);

  if (!isLoading) return null;

  return <LoadingOverlay />;
}
