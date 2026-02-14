"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Instagram, href: "https://www.instagram.com/ri.shaaall/", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/muhammedrishale/", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
          
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-3 max-w-xs w-full md:w-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                <span className="text-white text-lg sm:text-xl">🍃</span>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                NutriWise
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-600 text-center md:text-left leading-relaxed">
              Your trusted companion for nutrition, wellness, and healthy living.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6 text-sm sm:text-base text-gray-600 justify-center">
            <Link 
              href="/about" 
              className="hover:text-emerald-600 transition-colors font-medium hover:underline underline-offset-4"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="hover:text-emerald-600 transition-colors font-medium hover:underline underline-offset-4"
            >
              Contact
            </Link>
            <Link 
              href="/terms" 
              className="hover:text-emerald-600 transition-colors font-medium hover:underline underline-offset-4"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="hover:text-emerald-600 transition-colors font-medium hover:underline underline-offset-4"
            >
              Privacy
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-3 sm:gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-11 sm:h-11 bg-gray-100 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-600 rounded-full flex items-center justify-center text-gray-600 hover:text-white transition-all duration-300 hover:scale-110 hover:shadow-lg group"
                  aria-label={social.label}
                >
                  <Icon 
                    size={18} 
                    className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" 
                  />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 pt-6 sm:pt-8 border-t border-gray-200 text-xs sm:text-sm text-gray-500">
          <p>© {currentYear} NutriWise. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}