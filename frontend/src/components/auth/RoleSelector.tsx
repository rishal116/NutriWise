"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function RoleSelection() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    router.push(`/${role}/signup`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Choose Your Role</h1>
            <p className="text-gray-600 text-lg">Select how you want to continue</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Client Card */}
            <div
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleRoleSelect("client")}
            >
              <div className="bg-gradient-to-br from-green-100 to-green-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-md flex items-center justify-center">
                    <span className="text-6xl">🧘‍♀️</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm a Client</h2>
                <p className="text-gray-600 mb-6">
                  Personalized plans, progress tracking, and community support.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect("client");
                  }}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
                >
                  Continue as Client
                </button>
              </div>
            </div>

            {/* Nutritionist Card */}
            <div
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handleRoleSelect("nutritionist")}
            >
              <div className="bg-gradient-to-br from-teal-100 to-cyan-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-md flex items-center justify-center">
                    <span className="text-6xl">👨‍⚕️</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">I'm a Nutritionist</h2>
                <p className="text-gray-600 mb-6">
                  Manage clients, offer consultations, and grow your professional practice.
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRoleSelect("nutritionist");
                  }}
                  className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition"
                >
                  Continue as Nutritionist
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
