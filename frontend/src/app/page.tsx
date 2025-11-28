"use client";

import React, { useEffect } from "react";
import NutriWiseLanding from "./(public)/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";


const Page = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  return (
    <div>
      <NutriWiseLanding />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Page;
