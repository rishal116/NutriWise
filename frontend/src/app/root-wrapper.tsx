"use client";

import { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { restoreAuth } from "@/redux/slices/authSlice";
import type { RootState, AppDispatch } from "@/redux/store";

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  if (loading) return null;

  return <>{children}</>;
}
