"use client";

import SignupForm from "@/components/auth/register-form";
import {User, Heart, Sparkles, ArrowLeft } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-green-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100 rounded-full blur-3xl opacity-10"></div>
      </div>

      {/* Back to Home Button */}
      <a 
        href="/"
        className="absolute top-6 left-6 flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium"></span>
      </a>

      {/* Main Container */}
      <div className="relative w-full max-w-6xl">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 grid lg:grid-cols-2">
          {/* Left Side - Branding & Info */}
          <div className="hidden lg:flex bg-gradient-to-br from-green-500 to-green-700 p-12 flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
            
            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-12">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <Heart className="w-8 h-8 text-green-600" fill="currentColor" />
                </div>
                <span className="text-3xl font-bold text-white">NutriWise</span>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                    Start Your Wellness Journey Today
                  </h2>
                  <p className="text-green-50 text-lg leading-relaxed">
                    Join thousands of people achieving their health goals with personalized nutrition plans and expert guidance.
                  </p>
                </div>
                
                <div className="space-y-6 pt-8">
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Personalized Plans</h3>
                      <p className="text-green-50 text-sm">Custom diet plans tailored to your unique goals and preferences</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Expert Support</h3>
                      <p className="text-green-50 text-sm">Access to certified nutritionists and wellness coaches</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-lg mb-1">Community Challenges</h3>
                      <p className="text-green-50 text-sm">Stay motivated with fun challenges and supportive community</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 pt-8">
              <div className="flex items-center space-x-8 text-white/80 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>10k+ Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>500+ Experts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>98% Success Rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 lg:p-12">
            <div className="max-w-md mx-auto">
              {/* Mobile Header */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg mb-4">
                  <Heart className="w-8 h-8 text-white" fill="currentColor" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-gray-600">Join NutriWise and start your wellness journey</p>
              </div>

              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                <p className="text-gray-600">Fill in your details to get started</p>
              </div>

              <SignupForm />
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center space-x-8 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Privacy Protected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
