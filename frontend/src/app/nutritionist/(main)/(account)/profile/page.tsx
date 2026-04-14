"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';

export default function WelcomePage() {
  const containerVars: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVars: Variants = {
    initial: { y: 20, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden relative">
      
      {/* Background Canvas (Unicorn Studio) */}
      <div 
        className="absolute inset-0 z-0" 
        data-us-project="eyImM5hDic5M119WDpCm"
      />

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="text-center z-10"
      >
        <motion.div variants={itemVars} className="flex items-center justify-center gap-2 mb-6">
          <div className="h-[1px] w-8 bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Portal Access</span>
          <div className="h-[1px] w-8 bg-slate-200" />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-x-4">
          <motion.h1 
            variants={itemVars}
            className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter"
          >
            Welcome
          </motion.h1>
          <motion.h1 
            variants={itemVars}
            className="text-7xl md:text-9xl font-black text-emerald-600 tracking-tighter"
          >
            Doctor
          </motion.h1>
        </div>

        {/* Minimal Progress Indicator */}
        <div className="max-w-xs mx-auto mt-12 px-4">
          <div className="relative h-1 w-48 mx-auto bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut" }}
              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
            />
          </div>
          <motion.p 
            variants={itemVars}
            className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400"
          >
            Preparing your practice environment
          </motion.p>
        </div>
      </motion.div>

      {/* Ambient bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-emerald-50/40 to-transparent pointer-events-none" />
    </div>
  );
}