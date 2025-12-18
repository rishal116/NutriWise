"use client";

import { Star, Calendar, MessageCircle, ShieldCheck, Users } from "lucide-react";

export default function NutritionistDetailsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row gap-6">
          <img
            src="https://via.placeholder.com/150"
            alt="Nutritionist"
            className="w-36 h-36 rounded-2xl object-cover border"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Dr. Ananya Sharma</h1>
            <p className="text-green-600 font-medium mt-1">Certified Clinical Nutritionist</p>

            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500" /> 4.8 (320 reviews)
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> 120+ clients coached
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-600" /> Verified
              </span>
            </div>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* ABOUT */}
            <Card title="About">
              <p className="text-gray-700 text-sm leading-relaxed">
                I specialize in sustainable weight loss, metabolic health, and
                lifestyle-based nutrition coaching. My approach focuses on
                long-term habits rather than crash diets.
              </p>
            </Card>

            {/* EXPERTISE */}
            <Card title="Expertise">
              <div className="flex flex-wrap gap-2">
                {["Weight Loss", "PCOS", "Diabetes", "Gut Health", "Lifestyle Coaching"].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </Card>

            {/* COACHING STYLE */}
            <Card title="Coaching Style">
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✔ Personalized diet plans</li>
                <li>✔ Weekly progress reviews</li>
                <li>✔ Habit & lifestyle guidance</li>
                <li>✔ Direct chat support</li>
              </ul>
            </Card>

            {/* AVAILABLE PLANS */}
            <Card title="Available Plans">
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="border rounded-xl p-4 hover:shadow">
                    <h3 className="font-semibold">3 Month Weight Loss Coaching</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Weekly sessions • Chat support • Progress tracking
                    </p>
                    <p className="text-green-600 font-semibold mt-2">₹7,999</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6">

            {/* BOOKING */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Calendar size={18} /> Book Consultation
              </h3>
              <button className="w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700">
                View Available Slots
              </button>
            </div>

            {/* CONTACT */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <MessageCircle size={18} /> Contact
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Ask questions before subscribing to a plan
              </p>
              <button className="w-full py-3 rounded-xl border border-gray-300 hover:bg-gray-50">
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}
