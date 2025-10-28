"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-md z-50 border-b border-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 rounded-lg blur-sm opacity-50 group-hover:opacity-75 transition-opacity"></div>
              <Heart className="w-9 h-9 text-green-600 relative animate-pulse" fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">
              NutriWise
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/4">
            <Link
              href="#home"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-all rounded-lg hover:bg-green-50 relative group"
            >
              Home
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
            <Link
              href="#challenges"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-all rounded-lg hover:bg-green-50 relative group"
            >
              Challenges
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
            <Link
              href="#nutritionists"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-all rounded-lg hover:bg-green-50 relative group"
            >
              Nutritionists
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
            <Link
              href="#communities"
              className="px-4 py-2 text-gray-700 hover:text-green-600 font-medium transition-all rounded-lg hover:bg-green-50 relative group"
            >
              Communities
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-green-600 group-hover:w-3/4 transition-all duration-300"></span>
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-green-600 font-semibold hover:text-green-700 transition-all hover:bg-green-50 rounded-lg"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-green-500/50"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-6 pb-6 space-y-3 animate-fadeIn border-t border-gray-100 pt-6">
            <Link
              href="#home"
              className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="#challenges"
              className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Challenges
            </Link>
            <Link
              href="#nutritionists"
              className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Nutritionists
            </Link>
            <Link
              href="#communities"
              className="block px-4 py-3 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Communities
            </Link>

            {/* Mobile Buttons */}
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                href="/login"
                className="px-5 py-3 text-green-600 font-semibold border-2 border-green-600 rounded-full hover:bg-green-50 transition-all text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all shadow-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
