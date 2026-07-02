"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setToken, logout } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        setLoading(false);
        return;
      }

      try {
        const res = await userAuthService.refreshToken();

        dispatch(setToken(res.accessToken));
      } catch {
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch, token]);

  if (loading) {
    return null;
  }

  return <>{children}</>;
}