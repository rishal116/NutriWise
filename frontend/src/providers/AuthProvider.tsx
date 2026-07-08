"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout, setUser } from "@/redux/slices/authSlice";
import { userAuthService } from "@/services/user/userAuth.service";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const res = await userAuthService.getMe();
        console.log(res);
        

        if (!isMounted) return;

        dispatch(setUser(res.data));
      } catch {
        if (!isMounted) return;

        dispatch(logout());
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return <>{children}</>;
}
