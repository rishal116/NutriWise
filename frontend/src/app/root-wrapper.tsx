"use client";

import { useEffect, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, logout } from "@/redux/slices/authSlice";
import type { RootState, AppDispatch } from "@/redux/store";
import { api } from "@/lib/axios/api";
import { connectSocket } from "@/lib/socket";

interface RootWrapperProps {
  children: ReactNode;
}

export default function RootWrapper({ children }: RootWrapperProps) {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    connectSocket(token);
  }
}, []);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.post("/refresh-token");

        dispatch(setToken(res.data.accessToken));
      } catch (error) {
        dispatch(logout());
      }
    };

    restoreSession();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}