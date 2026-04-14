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
  const token = useSelector((state: RootState) => state.auth.token);
  const loading = useSelector((state: RootState) => state.auth.loading);

  useEffect(() => {
    if (token) {
      router.replace("/home");
    }
  }, [token, router]);

  if (loading) return null;

  return (
    <>
      <NutriWiseLanding />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}