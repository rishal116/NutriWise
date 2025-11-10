import React from 'react'
import NutriWiseLanding from './(public)/page'
import Header from '@/components/user/Header'
import Footer from '@/components/user/Footer'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  return (
    <div>
      <Header/>
      <NutriWiseLanding/>
      <Footer/>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default page
