"use client"

import React, { useState, useEffect } from 'react';
import { Heart, Users, Award, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const challenges = [
    {
      img: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800&q=80",
      title: "7-Day Detox",
      desc: "Clean your body and reset your health in one week.",
      color: "from-emerald-400 to-teal-500"
    },
    {
      img: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      title: "30-Day Weight Loss",
      desc: "Structured plan to gradually reduce weight with guidance.",
      color: "from-blue-400 to-indigo-500"
    },
    {
      img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      title: "Fitness Boost",
      desc: "Improve stamina and build discipline for a healthier lifestyle.",
      color: "from-purple-400 to-pink-500"
    }
  ];

  const communities = [
    { title: "Keto Enthusiasts", desc: "Discover recipes, diets, and proven success strategies.", icon: Heart, members: "12.5K" },
    { title: "Running Club", desc: "Find motivation, running tips, and community events.", icon: TrendingUp, members: "8.3K" },
    { title: "Mindful Eating", desc: "Learn mindful eating habits to control cravings.", icon: Sparkles, members: "15.2K" }
  ];

  const experts = [
    { img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", name: "Dr. Evelyn Reed", specialty: "Nutrition specialist with 10+ years of experience." },
    { img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", name: "Dr. Owen Bennett", specialty: "Weight management and wellness expert." },
    { img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80", name: "Dr. Clara Hayes", specialty: "PCOS, diabetes and metabolic health specialist." }
  ];

  const transformations = [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400&q=80",
    "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400&q=80",
    "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=400&q=80"
  ];

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 min-h-screen">

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto mt-24 px-4 mb-32">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />
          
          {/* Animated Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20 mix-blend-overlay z-10"
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
          
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200&q=80"
            alt="Healthy Lifestyle"
            className="w-full object-cover h-[600px] transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 flex items-center z-20 px-12 lg:px-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6 animate-fade-in">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white text-sm font-medium">Transform Your Life Today</span>
              </div>
              
              <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-slide-up">
                Your Journey to<br />
                <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  Better Health
                </span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 animate-slide-up-delay">
                Join thousands who've transformed their lives with personalized nutrition and expert guidance
              </p>
              
              <button className="group/btn px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full text-white font-semibold shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center gap-2">
                Explore Challenges
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CHALLENGES */}
      <section className="max-w-7xl mx-auto mt-16 px-4 mb-20">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Featured Challenges</h2>
            <p className="text-slate-600">Start your transformation journey today</p>
          </div>
          <button className="hidden md:flex items-center gap-2 px-6 py-3 text-green-600 hover:bg-green-50 rounded-full transition font-medium">
            View All <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {challenges.map((challenge, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredCard(`challenge-${i}`)}
              onMouseLeave={() => setHoveredCard(null)}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={challenge.img}
                  className="rounded-t-2xl w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={challenge.title}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${challenge.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-green-600 transition">
                  {challenge.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  {challenge.desc}
                </p>
                <button className="text-green-600 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all">
                  Learn More 
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="max-w-7xl mx-auto mt-32 px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Join Our Community</h2>
          <p className="text-slate-600 text-lg">Connect with like-minded individuals on similar journeys</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communities.map((community, i) => (
            <div
              key={i}
              className="relative group bg-gradient-to-br from-white to-slate-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/60 hover:border-green-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-500" />
              
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <community.icon className="w-7 h-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{community.title}</h3>
                <p className="text-slate-600 mb-4 leading-relaxed">{community.desc}</p>
                
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Users className="w-4 h-4" />
                  <span>{community.members} members</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            View More Communities
          </button>
        </div>
      </section>

      {/* EXPERTS */}
      <section className="max-w-7xl mx-auto mt-32 px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Meet Our Experts</h2>
          <p className="text-slate-600 text-lg">Learn from certified professionals dedicated to your success</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experts.map((expert, i) => (
            <div
              key={i}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={expert.img}
                  className="w-full h-72 object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={expert.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="w-full py-2 bg-white text-green-600 rounded-full font-semibold hover:bg-green-50 transition">
                    Book Consultation
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  <h3 className="text-xl font-bold text-slate-900">{expert.name}</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">{expert.specialty}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Meet More Experts
          </button>
        </div>
      </section>

      {/* TRANSFORMATIONS */}
      <section className="max-w-7xl mx-auto mt-32 px-4 mb-32">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-3">Real People. Real Results.</h2>
          <p className="text-slate-600 text-lg">Inspiring transformations from our community members</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {transformations.map((img, i) => (
            <div
              key={i}
              className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-pointer"
            >
              <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Transformation" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-full text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            Read More Stories
          </button>
        </div>
      </section>

    

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}