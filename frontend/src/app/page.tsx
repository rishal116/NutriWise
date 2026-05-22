"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import NutriWiseLanding from "./(public)/landing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const router = useRouter();

  const { token, user, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    if (token && user) {
      switch (user.activeRole) {
        case "nutritionist":
          router.replace("/nutritionist/dashboard");
          break;

        case "admin":
          router.replace("/admin");
          break;

        case "client":
        default:
          router.replace("/home");
          break;
      }
    }
  }, [token, user, router]);

  if (loading) return null;

  return (
    <>
      <NutriWiseLanding />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
