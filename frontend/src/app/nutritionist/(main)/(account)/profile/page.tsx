"use client";

import React, { useEffect } from 'react';
import { motion, Variants } from 'framer-motion'; // Added Variants type
import { Apple, Droplets, Zap, Activity } from 'lucide-react';

// 1. Fix: Tell TypeScript that UnicornStudio exists on the window object
declare global {
  interface Window {
    UnicornStudio: any;
  }
}

export default function WelcomePage() {
  useEffect(() => {
    const initUnicorn = () => {
      var u = window.UnicornStudio;
      if (u && u.init) {
        u.init();
      } else {
        window.UnicornStudio = { isInitialized: false };
        var i = document.createElement("script");
        i.src = "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.0-1/dist/unicornStudio.umd.js";
        i.onload = function() {
          // Fix: Access via window to avoid "Cannot find name" error
          if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => window.UnicornStudio.init());
          } else {
            window.UnicornStudio.init();
          }
        };
        (document.head || document.body).appendChild(i);
      }
    };

    initUnicorn();
  }, []);

  // 2. Fix: Explicitly type the variants as 'Variants'
  const containerVars: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.2 }
    }
  };

  const itemVars: Variants = {
    initial: { y: 40, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      // Added 'as const' to the ease array to fix the Easing error
      transition: { duration: 1, ease: [0.22, 1, 0.36, 1] as const }
    }
  };

  const floatVars = (delay: number): Variants => ({
    initial: { y: 0, opacity: 0 },
    animate: {
      y: [0, -20, 0],
      opacity: [0, 0.4, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut" 
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden relative">
      
      {/* Unicorn Studio Canvas Container */}
      <div 
        className="absolute inset-0 z-0" 
        style={{ width: '100%', height: '100%' }} 
        data-us-project="eyImM5hDic5M119WDpCm"
      ></div>

      {/* --- BACKGROUND DECORATION --- */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div variants={floatVars(0)} initial="initial" animate="animate" className="absolute top-[20%] left-[15%] text-emerald-200">
          <Apple size={48} strokeWidth={1} />
        </motion.div>
        <motion.div variants={floatVars(1.5)} initial="initial" animate="animate" className="absolute bottom-[25%] left-[20%] text-blue-200">
          <Droplets size={40} strokeWidth={1} />
        </motion.div>
        <motion.div variants={floatVars(0.8)} initial="initial" animate="animate" className="absolute top-[30%] right-[15%] text-orange-200">
          <Zap size={32} strokeWidth={1} />
        </motion.div>
        <motion.div variants={floatVars(2.2)} initial="initial" animate="animate" className="absolute bottom-[20%] right-[25%] text-teal-200">
          <Activity size={50} strokeWidth={1} />
        </motion.div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        className="text-center z-10"
      >
        <motion.div 
          variants={itemVars}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <div className="h-[1px] w-12 bg-slate-200" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-600">Pure Life</span>
          <div className="h-[1px] w-12 bg-slate-200" />
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-x-6">
          <motion.h1 
            variants={itemVars}
            className="text-7xl md:text-9xl font-black text-slate-900 tracking-tighter"
          >
            Hello
          </motion.h1>
          <motion.h1 
            variants={itemVars}
            className="text-7xl md:text-9xl font-black text-emerald-600 tracking-tighter"
          >
            Expert
          </motion.h1>
        </div>

        {/* Dynamic Loading Bar */}
        <div className="max-w-xs mx-auto mt-12 px-4">
          <div className="relative h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "circIn" }}
              className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full"
            />
          </div>
          <motion.div
            variants={itemVars}
            className="mt-4 flex flex-col items-center gap-2"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
              Personalizing your nutrition profile
            </p>
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-emerald-500 rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-emerald-50/50 to-transparent pointer-events-none" />
    </div>
  );
}