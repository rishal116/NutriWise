"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NutriWiseLanding from "./(public)/landing";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Page() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/home");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  return (
    <>
      <NutriWiseLanding />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
