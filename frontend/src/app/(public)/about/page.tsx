"use client";

import React from "react";
import { Heart, Users, Award, Target, Sparkles, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: "Health First",
      description: "We prioritize your wellbeing above all else, providing evidence-based nutrition guidance.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Building a supportive community where everyone can share their journey and inspire others.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: Award,
      title: "Expert Guidance",
      description: "Access to certified nutritionists and wellness experts dedicated to your success.",
      gradient: "from-emerald-600 to-teal-700"
    },
    {
      icon: Target,
      title: "Goal Oriented",
      description: "Helping you set realistic goals and providing the tools to achieve them sustainably.",
      gradient: "from-teal-600 to-cyan-700"
    }
  ];

  const stats = [
    { number: "100K+", label: "Active Users" },
    { number: "50+", label: "Expert Nutritionists" },
    { number: "200+", label: "Challenges Completed" },
    { number: "4.9★", label: "Average Rating" }
  ];

  const team = [
    {
      initial: "S",
      name: "Sarah Johnson",
      role: "Founder & CEO",
      gradient: "from-emerald-400 to-teal-500"
    },
    {
      initial: "M",
      name: "Michael Chen",
      role: "Head of Nutrition",
      gradient: "from-teal-400 to-cyan-500"
    },
    {
      initial: "E",
      name: "Emily Davis",
      role: "Community Manager",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      initial: "D",
      name: "David Brown",
      role: "Chief Technology Officer",
      gradient: "from-teal-500 to-cyan-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 sm:py-24 lg:py-32">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">About NutriWise</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Empowering Your{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            NutriWise is more than just a nutrition app—it's a comprehensive wellness platform designed to help you achieve your health goals through personalized guidance, expert support, and a thriving community.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-3xl sm:text-4xl font-bold">{stat.number}</div>
                <div className="text-sm sm:text-base opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, NutriWise was born from a simple vision: to make professional nutrition guidance accessible to everyone, regardless of their location or budget.
                </p>
                <p>
                  We noticed that many people struggled to maintain healthy eating habits due to lack of personalized guidance, accountability, and community support. That's why we created a platform that combines expert nutritionist consultations with engaging challenges and a supportive community.
                </p>
                <p>
                  Today, we're proud to serve over 100,000 users worldwide, helping them transform their relationships with food and achieve lasting wellness results.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <TrendingUp className="w-40 h-40 text-white opacity-90" />
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-300 rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-teal-300 rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                className="bg-white p-6 lg:p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <value.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind NutriWise
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                <div className={`h-48 bg-gradient-to-br ${member.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-4xl group-hover:scale-110 transition-transform">
                    {member.initial}
                  </div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-emerald-600 font-medium">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of members who are already transforming their health with NutriWise.
          </p>
          <button className="px-8 sm:px-10 py-4 bg-white text-emerald-600 text-lg font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
            Get Started Today
          </button>
        </div>
      </section>
    </div>
  );
}