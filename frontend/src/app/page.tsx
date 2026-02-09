"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import NutriWiseLanding from "./(public)/page";
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
  }, []);

if (checking) return null;

  return (
    <>
      <NutriWiseLanding />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
