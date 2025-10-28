"use client";

import React from 'react';
import { Instagram, Facebook, Twitter, Linkedin, Heart, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const links = [
    { name: "Contact", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-5 h-5" />, href: "https://www.instagram.com/ri.shaaall/", label: "Instagram" },
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "https://x.com/rishal99477", label: "Twitter" },
    { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/muhammed-rishal-472456324/", label: "LinkedIn" },
  ];

  const quickLinks = [
    { name: "Home", href: "#home" },
    { name: "Challenges", href: "#challenges" },
    { name: "Nutritionists", href: "#nutritionists" },
    { name: "Communities", href: "#communities" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-green-400 to-green-600 p-2 rounded-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                NutriWise
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted platform for healthy living, personalized nutrition plans, and expert guidance on your wellness journey.
            </p>
            <div className="flex space-x-3 pt-2">
              {socialLinks.map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="bg-gray-800 p-3 rounded-full hover:bg-gradient-to-br hover:from-green-400 hover:to-green-600 text-gray-400 hover:text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg hover:shadow-green-500/50"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Legal
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
            </h4>
            <ul className="space-y-3">
              {links.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors duration-300 text-sm flex items-center space-x-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300"></span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6 relative inline-block">
              Get In Touch
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></span>
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-gray-400 group">
                <Mail className="w-5 h-5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-green-400 transition-colors">support@nutriwise.com</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400 group">
                <Phone className="w-5 h-5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-green-400 transition-colors">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3 text-sm text-gray-400 group">
                <MapPin className="w-5 h-5 text-green-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-green-400 transition-colors">123 Wellness Street<br />Health City, HC 12345</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear}{" "}
            <span className="font-semibold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              NutriWise
            </span>
            . All rights reserved. Empowering your wellness journey.
          </p>
          <div className="flex items-center space-x-6 text-xs text-gray-500">
            <a href="#" className="hover:text-green-400 transition-colors">Sitemap</a>
            <span>•</span>
            <a href="#" className="hover:text-green-400 transition-colors">Accessibility</a>
            <span>•</span>
            <a href="#" className="hover:text-green-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>

      {/* Animated Bottom Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-600"></div>
    </footer>
  );
}
