"use client";

import { useAppSelector } from "@/redux/hooks";
import LoadingOverlay from "./LoadingOverlay";

export default function GlobalLoading() {
  const { isLoading, loadingText } = useAppSelector((state) => state.ui);

  if (!isLoading) return null;

  return <LoadingOverlay text={loadingText} />;
}
