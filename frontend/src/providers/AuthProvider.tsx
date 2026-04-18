"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { api } from "@/lib/axios/api";
import { setToken, logout } from "@/redux/slices/authSlice";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get("/refresh-token");

        dispatch(setToken(res.data.accessToken));
      } catch (err) {
        console.log(err);
        dispatch(logout());
      }
    };

    initAuth();
  }, [dispatch]);

  return <>{children}</>;
}
