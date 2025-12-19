"use client";

import { motion } from "framer-motion";

export default function NutritionistDetailPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* ================= PROFILE HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm p-6 flex flex-col md:flex-row gap-6"
        >
          <img
            src="https://via.placeholder.com/160"
            alt="Nutritionist"
            className="w-40 h-40 rounded-2xl object-cover"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-semibold">Dr. Ananya Sharma</h1>
            <p className="text-gray-600 mt-1">Clinical Nutritionist & Dietitian</p>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
              <span>⭐ 4.8 (210 clients)</span>
              <span>📍 Online / Bangalore</span>
              <span>🕒 8+ years experience</span>
            </div>

            <div className="mt-6">
              <button className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition">
                View Subscription Plans
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= HOW I HELP ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl shadow-sm p-6"
        >
          <h2 className="text-2xl font-semibold mb-4">How I Help You</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <li>✔ Personalized diet plans</li>
            <li>✔ Continuous progress monitoring</li>
            <li>✔ Lifestyle & habit correction</li>
            <li>✔ Regular plan adjustments</li>
            <li>✔ Direct chat support</li>
            <li>✔ Sustainable long-term results</li>
          </ul>
        </motion.div>

        {/* ================= SPECIALIZATIONS ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Specializations</h2>
          <div className="flex flex-wrap gap-3">
            {["Weight Loss", "PCOS", "Diabetes", "Gut Health", "Sports Nutrition"].map(
              (item) => (
                <span
                  key={item}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm"
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>

        {/* ================= SUBSCRIPTION PLANS ================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-6">Subscription Plans</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border">
              <h3 className="text-xl font-semibold">Starter</h3>
              <p className="text-gray-500 text-sm mt-1">Best for beginners</p>

              <p className="text-3xl font-bold text-green-600 mt-4">₹1,499</p>
              <p className="text-sm text-gray-500">per month</p>

              <ul className="mt-4 space-y-2 text-gray-700">
                <li>✔ Monthly diet plan</li>
                <li>✔ Chat support (48h)</li>
                <li>✔ Monthly progress review</li>
              </ul>

              <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl shadow-md p-6 border-2 border-green-600">
              <h3 className="text-xl font-semibold">Pro</h3>
              <p className="text-gray-500 text-sm mt-1">Most popular</p>

              <p className="text-3xl font-bold text-green-600 mt-4">₹2,999</p>
              <p className="text-sm text-gray-500">per month</p>

              <ul className="mt-4 space-y-2 text-gray-700">
                <li>✔ Weekly diet updates</li>
                <li>✔ Priority chat support</li>
                <li>✔ Weekly progress tracking</li>
                <li>✔ Lifestyle guidance</li>
              </ul>

              <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>

            {/* Elite */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border">
              <h3 className="text-xl font-semibold">Elite</h3>
              <p className="text-gray-500 text-sm mt-1">Complete care</p>

              <p className="text-3xl font-bold text-green-600 mt-4">₹4,999</p>
              <p className="text-sm text-gray-500">per month</p>

              <ul className="mt-4 space-y-2 text-gray-700">
                <li>✔ Fully customized plan</li>
                <li>✔ Daily chat support</li>
                <li>✔ Weekly check-ins</li>
                <li>✔ Supplement guidance</li>
              </ul>

              <button className="w-full mt-6 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* ================= HOW IT WORKS ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">How Subscription Works</h2>
          <ol className="list-decimal ml-6 space-y-2 text-gray-700">
            <li>Select a subscription plan</li>
            <li>Fill your health & lifestyle details</li>
            <li>Nutritionist designs your plan</li>
            <li>Track progress & chat regularly</li>
          </ol>
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Client Transformations</h2>

          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="font-medium">Rohit Mehra</p>
              <p className="text-sm text-gray-600">
                Lost 8kg in 3 months with continuous guidance. Highly recommend!
              </p>
            </div>

            <div>
              <p className="font-medium">Sneha Patel</p>
              <p className="text-sm text-gray-600">
                PCOS symptoms reduced significantly after 2 months of follow-up.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
