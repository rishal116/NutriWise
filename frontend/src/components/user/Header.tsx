"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  // Dynamic navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Challenges", href: "/challenges" },
    { name: "Nutritionists", href: "/nutritionists" },
    { name: "Communities", href: "/communities" },
  ];

  // Simulate authentication (replace with your actual auth state)
  const isLoggedIn = false; // Example: useContext(AuthContext) or check token

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍃</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              NutriWise
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-gray-700 hover:text-green-600 transition font-medium ${
                  pathname === link.href ? "text-green-600 font-semibold" : ""
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => router.push("/signup")}
                  className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition cursor-pointer"
                >
                  Get Started
                </button>
                <button
                  onClick={() => router.push("/login")}
                  className="text-gray-700 hover:text-green-600 font-medium transition cursor-pointer"
                >
                  Login
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
              >
                Dashboard
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
