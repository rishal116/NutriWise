"use client";
import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

interface FooterLink {
  label: string;
  href: string;
}

interface SocialLink {
  icon: React.ElementType;
  href: string;
}

interface FooterProps {
  companyName?: string;
  footerLinks?: FooterLink[];
  socialLinks?: SocialLink[];
}

export default function Footer({
  companyName = "NutriWise",
  footerLinks = [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
  socialLinks = [
    { icon: Facebook, href: "https://facebook.com" },
    { icon: Instagram, href: "https://www.instagram.com/ri.shaaall/" },
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/muhammed-rishal-472456324/" },
  ],
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Footer Navigation Links */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-6 text-sm text-gray-600">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-green-600 transition"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex space-x-6">
            {socialLinks.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-green-600 transition"
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-sm text-gray-500">
          © {currentYear} {companyName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
