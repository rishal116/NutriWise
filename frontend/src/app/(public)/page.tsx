"use client"
import React, { useEffect, useState } from 'react';
import { Heart, TrendingUp, Users, Trophy, Calendar, CheckCircle, Star, Facebook, Instagram, Twitter, Linkedin, Apple, Zap, Shield, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NutriWiseLanding() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/home");
    }
  }, [router]);

  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { name: "Home", id: "home" },
    { name: "Challenges", id: "challenges" },
    { name: "Nutritionists", id: "nutritionists" },
    { name: "Communities", id: "communities" },
  ];

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScrollEvent = () => {
      setScrolled(window.scrollY > 20);
      
      let current = "home";
      navLinks.forEach((link) => {
        const section = document.getElementById(link.id);
        if (section) {
          const top = section.getBoundingClientRect().top;
          if (top <= 100) current = link.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollEvent);
    return () => window.removeEventListener("scroll", handleScrollEvent);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div
              className="flex items-center space-x-3 cursor-pointer group"
              onClick={() => handleScroll("home")}
            >
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍃</span>
            </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent">NutriWise</span>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleScroll(link.id)}
                  className={`px-5 py-2.5 font-medium rounded-xl transition-all ${
                    activeSection === link.id
                      ? "text-white bg-gradient-to-r from-green-600 to-green-700 shadow-lg"
                      : "text-gray-700 hover:text-green-600 hover:bg-green-50"
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => router.push("/signup")}
              className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
              <button onClick={() => router.push("/login")}
              className="text-gray-700 hover:text-green-600 font-semibold transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="pt-32 pb-24 bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-block">
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-semibold">🎉 Join 100,000+ Happy Members</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Your Journey to <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Better Health</span> Starts Here
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Personalized diet plans, expert nutritionists, and a supportive community—all in one place. Transform your life today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button className="group px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2">
                  Explore Challenges
                  <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                </button>
                <button className="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-full border-2 border-gray-200 hover:border-green-500 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Watch Demo
                </button>
              </div>
              <div className="flex items-center gap-8 justify-center lg:justify-start pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">100K+</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">App Rating</div>
                </div>
                <div className="h-12 w-px bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Expert Coaches</div>
                </div>
              </div>
            </div>
            <div className="flex-1 relative">
              <div className="relative w-full h-[500px] rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-500">
                  <Heart className="w-40 h-40 text-white animate-pulse drop-shadow-2xl" />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-blue-400 rounded-full opacity-20 blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <Award className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-90">Success Stories</div>
            </div>
            <div>
              <Shield className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">100%</div>
              <div className="text-sm opacity-90">Certified Experts</div>
            </div>
            <div>
              <Trophy className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">200+</div>
              <div className="text-sm opacity-90">Active Challenges</div>
            </div>
            <div>
              <Users className="w-8 h-8 mx-auto mb-2 opacity-90" />
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-90">Communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Features</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">
              Empowering Your Wellness Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to achieve your health goals in one powerful platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Calendar, title: "Personalized Diet Plans", desc: "Custom-tailored diet plans designed by certified nutritionists, aligning with your health goals and dietary preferences.", gradient: "from-green-500 to-emerald-600" },
              { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor your progress, celebrate milestones, and adjust your plan as needed to stay on track.", gradient: "from-blue-500 to-cyan-600" },
              { icon: Heart, title: "Expert Nutritionists", desc: "Access one-on-one consultations with experienced nutritionists for personalized guidance and support.", gradient: "from-pink-500 to-rose-600" },
              { icon: Trophy, title: "Fun Challenges", desc: "Engage in fun and motivating community challenges to stay active and achieve your fitness goals together.", gradient: "from-purple-500 to-violet-600" },
              { icon: Users, title: "Supportive Community", desc: "Connect with a vibrant community of like-minded individuals for motivation, support, and shared experiences.", gradient: "from-orange-500 to-amber-600" },
              { icon: CheckCircle, title: "Achieve Your Goals", desc: "Set realistic goals and achieve them with our comprehensive tracking and support system.", gradient: "from-teal-500 to-emerald-600" }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 rounded-3xl bg-gradient-to-br from-gray-50 to-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Challenges Section */}
      <section id="challenges" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Challenges</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Featured Challenges</h2>
            <p className="text-xl text-gray-600">Join thousands in achieving their health goals</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Trophy, title: "7-Day Detox", desc: "Cleanse your body and reset your health in just one week.", gradient: "from-green-400 to-emerald-600", participants: "2.5K" },
              { icon: TrendingUp, title: "30-Day Weight Loss", desc: "Achieve your weight loss goals with our comprehensive 30-day program.", gradient: "from-blue-400 to-cyan-600", participants: "5.2K" },
              { icon: Heart, title: "Fitness Boost", desc: "Elevate your fitness levels with our dynamic and engaging fitness challenge.", gradient: "from-purple-400 to-violet-600", participants: "3.8K" }
            ].map((challenge, idx) => (
              <div key={idx} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`h-56 bg-gradient-to-br ${challenge.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <challenge.icon className="w-24 h-24 text-white group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-semibold text-gray-900">
                    {challenge.participants} joined
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{challenge.title}</h3>
                  <p className="text-gray-600 mb-6">{challenge.desc}</p>
                  <button className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 transition-all">
                    Join Challenge →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white text-green-600 font-semibold rounded-full border-2 border-green-600 hover:bg-green-50 transition-all transform hover:scale-105 shadow-lg">
              View All Challenges
            </button>
          </div>
        </div>
      </section>

      {/* Nutritionists Section */}
      <section id="nutritionists" className="py-24 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Our Experts</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Meet Our Expert Nutritionists</h2>
            <p className="text-xl text-gray-600">Learn from certified professionals dedicated to your success</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { initials: "ER", name: "Dr. Evelyn Reed", specialty: "Weight Management", desc: "With over 15 years of experience, Dr. Reed specializes in personalized weight management plans.", gradient: "from-green-400 to-emerald-600" },
              { initials: "OB", name: "Dr. Owen Bennett", specialty: "Sports Nutrition", desc: "Dr. Bennett helps athletes optimize their performance through targeted nutrition strategies.", gradient: "from-blue-400 to-cyan-600" },
              { initials: "CH", name: "Dr. Clara Hayes", specialty: "Holistic Wellness", desc: "Dr. Hayes integrates nutrition with lifestyle for overall health and wellbeing.", gradient: "from-purple-400 to-violet-600" }
            ].map((expert, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`w-28 h-28 bg-gradient-to-br ${expert.gradient} rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl`}>
                  <span className="text-4xl text-white font-bold">{expert.initials}</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">{expert.name}</h3>
                <p className="text-green-600 text-center font-semibold mb-4">{expert.specialty}</p>
                <p className="text-gray-600 text-center leading-relaxed mb-6">{expert.desc}</p>
                <button className="w-full py-3 text-green-600 font-semibold rounded-xl border-2 border-green-600 hover:bg-green-50 transition-all">
                  Book Consultation
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Communities Section */}
      <section id="communities" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Communities</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Join Our Thriving Communities</h2>
            <p className="text-xl text-gray-600">Connect with people who share your health journey</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Keto Enthusiasts", desc: "Connect with others following a ketogenic diet. Share recipes, tips, and support each other's progress.", gradient: "from-green-50 to-emerald-100", members: "12.5K" },
              { icon: Trophy, title: "Running Club", desc: "Join fellow runners of all levels. Find training partners, discuss routes, and celebrate your runs.", gradient: "from-blue-50 to-cyan-100", members: "8.3K" },
              { icon: Heart, title: "Mindful Eating", desc: "Practice mindful eating techniques together. Share experiences and support for a healthier relationship with food.", gradient: "from-purple-50 to-violet-100", members: "15.2K" }
            ].map((community, idx) => (
              <div key={idx} className={`p-8 bg-gradient-to-br ${community.gradient} rounded-3xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden`}>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-900 shadow-lg">
                  {community.members} members
                </div>
                <community.icon className="w-14 h-14 text-green-600 mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{community.title}</h3>
                <p className="text-gray-600 leading-relaxed">{community.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-xl">
              Explore All Communities
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-green-600 font-semibold text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-3 mb-4">Real People. Real Results.</h2>
            <p className="text-xl text-gray-600">See what our community has achieved</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Isabella", initial: "I", quote: "NutriWise transformed my relationship with food. I've never felt healthier or more energized!", gradient: "from-green-300 to-emerald-400" },
              { name: "Liam", initial: "L", quote: "Thanks to NutriWise, I finally achieved my weight loss goals and gained a sustainable, healthy lifestyle.", gradient: "from-blue-300 to-cyan-400" },
              { name: "Ava", initial: "A", quote: "The community support and expert guidance on NutriWise have been invaluable. I'm so grateful for this app!", gradient: "from-purple-300 to-violet-400" }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic text-lg leading-relaxed">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {testimonial.initial}
                  </div>
                  <div className="ml-4">
                    <p className="font-bold text-gray-900 text-lg">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">Member since 2024</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of members who are already on their journey to better health. Start your transformation today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-green-600 text-lg font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
              Start Free Trial
            </button>
            <button className="px-10 py-4 bg-transparent text-white text-lg font-bold rounded-full border-2 border-white hover:bg-white/10 transition-all transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🍃</span>
                </div>
                <span className="text-xl font-bold text-gray-900">NutriWise</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                Empowering your wellness journey with personalized nutrition and expert guidance.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-2">
                {["About", "Careers", "Press", "Blog"].map(item => (
                  <li key={item}><a href="#" className="text-gray-600 hover:text-green-600 transition text-sm">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2">
                {["Help Center", "Contact", "Terms of Service", "Privacy Policy"].map(item => (
                  <li key={item}><a href="#" className="text-gray-600 hover:text-green-600 transition text-sm">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, href: "https://facebook.com" },
                  { icon: Instagram, href: "https://www.instagram.com/ri.shaaall/" },
                  { icon: Twitter, href: "https://twitter.com" },
                  { icon: Linkedin, href: "https://www.linkedin.com/in/muhammed-rishal-472456324/" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-green-600 hover:text-white transition-all"
                  >
                    <social.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} NutriWise. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}