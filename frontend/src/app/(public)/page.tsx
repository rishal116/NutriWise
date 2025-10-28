"use client"
import React from 'react';
import { Heart, TrendingUp, Users, Trophy, Calendar, CheckCircle, Star, Menu, X } from 'lucide-react';

export default function NutriWiseLanding() {

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-green-50 via-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Your Journey to <span className="text-green-600">Better Health</span> Starts Here
              </h1>
              <p className="text-xl text-gray-600">
                Personalized diet plans, expert nutritionists, and a supportive community.
              </p>
              <button className="px-8 py-4 bg-green-600 text-white text-lg rounded-full hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                Explore Challenges
              </button>
            </div>
            <div className="flex-1">
              <div className="relative w-full h-96 bg-gradient-to-br from-green-200 to-green-400 rounded-3xl flex items-center justify-center shadow-2xl">
                <Heart className="w-32 h-32 text-white animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            Empowering Your Wellness Journey
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <Calendar className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Personalized Diet Plans</h3>
              <p className="text-gray-600">Receive custom-tailored diet plans designed by certified nutritionists, aligning with your health goals and dietary preferences.</p>
            </div>

            <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <TrendingUp className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your progress, celebrate milestones, and adjust your plan as needed to stay on track.</p>
            </div>

            <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <Heart className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Nutritionists</h3>
              <p className="text-gray-600">Access one-on-one consultations with experienced nutritionists for personalized guidance and support.</p>
            </div>

            <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <Trophy className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fun Challenges</h3>
              <p className="text-gray-600">Engage in fun and motivating community challenges to stay active, connect with others, and achieve your fitness goals together.</p>
            </div>

            <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Supportive Community</h3>
              <p className="text-gray-600">Connect with a vibrant community of like-minded individuals for motivation, support, and shared experiences.</p>
            </div>

            <div className="p-6 rounded-2xl bg-green-50 hover:bg-green-100 transition-all transform hover:scale-105 hover:shadow-lg">
              <CheckCircle className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Achieve Your Goals</h3>
              <p className="text-gray-600">Set realistic goals and achieve them with our comprehensive tracking and support system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section id="challenges" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Featured Challenges</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Trophy className="w-20 h-20 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">7-Day Detox</h3>
                <p className="text-gray-600 mb-4">Cleanse your body and reset your health in just one week.</p>
                <button className="text-green-600 font-semibold hover:text-green-700">Learn More →</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <TrendingUp className="w-20 h-20 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">30-Day Weight Loss</h3>
                <p className="text-gray-600 mb-4">Achieve your weight loss goals with our comprehensive 30-day program.</p>
                <button className="text-green-600 font-semibold hover:text-green-700">Learn More →</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="h-48 bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                <Heart className="w-20 h-20 text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Fitness Boost</h3>
                <p className="text-gray-600 mb-4">Elevate your fitness levels with our dynamic and engaging fitness challenge.</p>
                <button className="text-green-600 font-semibold hover:text-green-700">Learn More →</button>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              View All Challenges
            </button>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="communities" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Community</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
              <Users className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Keto Enthusiasts</h3>
              <p className="text-gray-600">Connect with others following a ketogenic diet. Share recipes, tips, and support each other's progress.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
              <Trophy className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Running Club</h3>
              <p className="text-gray-600">Join fellow runners of all levels. Find training partners, discuss routes, and celebrate your runs.</p>
            </div>

            <div className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl hover:shadow-xl transition-all transform hover:scale-105">
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mindful Eating</h3>
              <p className="text-gray-600">Practice mindful eating techniques together. Share experiences, recipes, and support for a healthier relationship with food.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              View More Communities
            </button>
          </div>
        </div>
      </section>

      {/* Experts Section */}
      <section id="nutritionists" className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Meet Our Experts</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">ER</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Dr. Evelyn Reed</h3>
              <p className="text-green-600 text-center font-semibold mb-4">Weight Management</p>
              <p className="text-gray-600 text-center">With over 15 years of experience, Dr. Reed specializes in personalized weight management plans.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">OB</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Dr. Owen Bennett</h3>
              <p className="text-green-600 text-center font-semibold mb-4">Sports Nutrition</p>
              <p className="text-gray-600 text-center">Dr. Bennett helps athletes optimize their performance through targeted nutrition strategies.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl text-white font-bold">CH</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Dr. Clara Hayes</h3>
              <p className="text-green-600 text-center font-semibold mb-4">Holistic Wellness</p>
              <p className="text-gray-600 text-center">Dr. Hayes integrates nutrition with lifestyle for overall health and wellbeing.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              Meet Our Experts
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Real People. Real Results.</h2>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"NutriWise transformed my relationship with food. I've never felt healthier or more energized!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-300 rounded-full flex items-center justify-center text-white font-bold">I</div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Isabella</p>
                  <p className="text-sm text-gray-600">Member since 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"Thanks to NutriWise, I finally achieved my weight loss goals and gained a sustainable, healthy lifestyle."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-300 rounded-full flex items-center justify-center text-white font-bold">L</div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Liam</p>
                  <p className="text-sm text-gray-600">Member since 2024</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"The community support and expert guidance on NutriWise have been invaluable. I'm so grateful for this app!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-300 rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">Ava</p>
                  <p className="text-sm text-gray-600">Member since 2024</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg">
              Read More Stories
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-green-600 to-green-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Health?
          </h2>
          <button className="px-10 py-4 bg-white text-green-600 text-lg font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
            Explore New Challenges
          </button>
        </div>
      </section>
    </div>
  );
}