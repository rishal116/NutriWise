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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start gap-2 max-w-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">🍃</span>
              </div>
              <span className="text-lg font-bold text-gray-900">NutriWise</span>
            </div>
            <p className="text-sm text-gray-600 text-center md:text-left">
              Your trusted companion for nutrition, wellness, and healthy living.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-600 justify-center">
            <Link href="/about" className="hover:text-green-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-green-600 transition-colors">
              Contact
            </Link>
            <Link href="/terms" className="hover:text-green-600 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-green-600 transition-colors">
              Privacy
            </Link>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-600 transition-colors"
                  aria-label={social.label}
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 pt-6 border-t border-gray-200 text-sm text-gray-500">
          © {currentYear} NutriWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}