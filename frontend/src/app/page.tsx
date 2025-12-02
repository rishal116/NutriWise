import React from "react";
import NutriWiseLanding from "./(public)/page";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata = {
  title: "NutriWise – Landing Page",
};

const Page = () => {
  return (
    <div>
      <NutriWiseLanding />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Page;
