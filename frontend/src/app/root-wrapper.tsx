"use client";

import { useEffect, ReactNode } from "react";
import { useDispatch } from "react-redux";
import { restoreAuth } from "@/redux/slices/authSlice";

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(restoreAuth());
  }, [dispatch]);

  return <div>{children}</div>;
}
