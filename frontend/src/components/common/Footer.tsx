"use client";

import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    {
      icon: Instagram,
      href: "https://www.instagram.com/ri.shaaall/",
      label: "Instagram",
    },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/muhammedrishale/",
      label: "LinkedIn",
    },
  ];

  const footerLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
  ];

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-6">
          {/* Logo & tagline */}
          <div className="flex flex-col items-center md:items-start gap-2.5 max-w-xs">
            <Logo size="default" href="/" />
            <p className="text-sm text-gray-500 text-center md:text-left leading-relaxed">
              Your trusted companion for nutrition, wellness, and healthy
              living.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-gray-600 font-medium hover:text-emerald-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex gap-2.5">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 bg-gray-100 hover:bg-emerald-600 rounded-xl flex items-center justify-center text-gray-500 hover:text-white transition-colors"
                >
                  <Icon size={17} />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400">
          © {currentYear} NutriWise. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
