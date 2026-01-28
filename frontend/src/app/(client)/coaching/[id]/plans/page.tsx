"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import { NutritionistProfileDTO } from "@/constants/nutritionistProfile.constants";
import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import { CheckCircle, ArrowLeft, Award, Calendar, Users, TrendingUp, Sparkles, Clock, DollarSign } from "lucide-react";
import { getUserId, getUserRole } from "@/utils/jwt";

interface Plan {
  id: string;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  currency: string;
  features: string[];
}

export default function NutritionistPlansPage() {
  const { id } = useParams();
  const router = useRouter();
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profile, setProfile] = useState<NutritionistProfileDTO | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, plansRes] = await Promise.all([
          nutritionistListService.getById(id as string),
          nutritionistListService.getPlans(id as string),
        ]);

        setProfile(profileRes);
        setPlans(plansRes?.data ?? []);
        setSelectedPlan(plansRes?.data?.[0] ?? null);

        const userId = getUserId();
        const role = getUserRole();
        console.log(userId, " ", role);

        if (role === "nutritionist" && userId === profileRes.id) {
          setIsOwnProfile(true);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-4"></div>
          <p className="text-emerald-700 font-semibold">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-32">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Profile</span>
          </button>

          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Choose Your Plan
          </h1>
          <p className="text-gray-600 text-lg mb-4">
            Select a personalized nutrition program designed for sustainable, lasting results
          </p>
          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/home" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Fitness & Nutrition", href: "#" },
              { label: profile.fullName, href: `/coaching/${id}` },
              { label: "Plans" },
            ]}
          />
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl">
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnpNMTIgMThjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6bTAgMTJjMy4zMTQgMCA2IDIuNjg2IDYgNnMtMi42ODYgNi02IDYtNi0yLjY4Ni02LTYgMi42ODYtNiA2LTZ6IiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iLjUiIG9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
          
          <div className="relative z-10 p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <div className="absolute -inset-2 bg-white/30 rounded-full blur-xl"></div>
              <img
                src={profile.profileImage || "/images/images.jpg"}
                className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
                alt={profile.fullName}
              />
              {profile.nutritionistStatus === "TOP_COACH" && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-2 shadow-lg border-2 border-white">
                  <Award className="text-white" size={20} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">{profile.fullName}</h2>
              <p className="text-emerald-50 text-lg mb-4">Certified Nutrition Coach</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  <Users size={16} />
                  {profile.totalPeopleCoached || 0} Clients
                </span>
                <span className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  <TrendingUp size={16} />
                  {profile.totalExperienceYears || 0} Years Exp
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT — PLANS */}
        <div className="lg:col-span-7 space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Plans</h2>
            <p className="text-gray-600">Select the plan that best fits your goals and lifestyle</p>
          </div>

          {plans.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">No plans available at the moment</p>
            </div>
          ) : (
            plans.map((plan, index) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`group cursor-pointer rounded-2xl p-6 border-2 transition-all duration-300 ${
                  selectedPlan?.id === plan.id
                    ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-lg"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {plan.title}
                      </h3>
                      {index === 0 && (
                        <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          POPULAR
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Clock size={16} className="text-emerald-600" />
                        {plan.durationInDays} days
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sparkles size={16} className="text-teal-600" />
                        {plan.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Price</p>
                      <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        {plan.currency} {plan.price}
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedPlan?.id === plan.id
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-gray-300 group-hover:border-emerald-400"
                    }`}>
                      {selectedPlan?.id === plan.id && (
                        <CheckCircle className="text-white" size={16} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* RIGHT — DETAILS */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 sticky top-24">
            {selectedPlan ? (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedPlan.title}</h3>
                    <p className="text-gray-500 flex items-center gap-2">
                      <Calendar size={16} />
                      {selectedPlan.durationInDays} days program
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 mb-6 border border-emerald-200">
                  <p className="text-sm text-gray-600 mb-2">Total Investment</p>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    {selectedPlan.currency} {selectedPlan.price}
                  </div>
                  <p className="text-sm text-emerald-700 mt-2">
                    ~{selectedPlan.currency} {(selectedPlan.price / selectedPlan.durationInDays).toFixed(2)} per day
                  </p>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles size={18} className="text-emerald-600" />
                    What's Included
                  </h4>
                  <ul className="space-y-3">
                    {selectedPlan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-3 text-gray-700">
                        <CheckCircle className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Pro Tip:</strong> This plan is designed to give you sustainable results with expert guidance every step of the way.
                  </p>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <DollarSign className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500">Select a plan to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="max-w-7xl mx-auto px-6 mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            How Our Coaching Program Works
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            A simple, proven process to help you achieve your nutrition and wellness goals
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-emerald-200 via-teal-200 to-cyan-200 -translate-x-1/2 hidden md:block" />

          <div className="space-y-12">
            {[
              {
                step: "01",
                icon: Sparkles,
                title: "Choose a Suitable Plan",
                desc: "Select a nutrition program aligned with your health and fitness goals.",
                color: "from-emerald-500 to-teal-500",
              },
              {
                step: "02",
                icon: Users,
                title: "Get Assigned a Certified Coach",
                desc: "A professional nutritionist will guide and monitor your progress.",
                color: "from-teal-500 to-cyan-500",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Start Your Wellness Journey",
                desc: "Follow your plan with continuous expert support and measurable results.",
                color: "from-cyan-500 to-blue-500",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-8 w-full md:w-[45%] hover:shadow-xl transition-shadow">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}>
                    <item.icon size={24} />
                  </div>
                  <div className="text-emerald-600 font-bold text-sm mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full z-10 hidden md:flex items-center justify-center text-white font-bold shadow-lg">
                  {item.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STICKY CTA */}
      {selectedPlan && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-2xl p-4 z-50">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 px-6">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-500">Selected Plan</p>
              <p className="font-bold text-gray-900">
                {selectedPlan.title} • <span className="text-emerald-600">{selectedPlan.currency} {selectedPlan.price}</span>
              </p>
            </div>

            {isOwnProfile ? (
              <button
                disabled
                className="w-full sm:w-auto bg-gray-200 text-gray-500 px-8 py-4 rounded-xl font-semibold cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>You cannot purchase your own plan</span>
              </button>
            ) : (
            <button
            onClick={() =>
              router.push(`/coaching/${id}/checkout?planId=${selectedPlan.id}`)}
              className="
              w-full sm:w-auto
              min-h-[64px]
              px-8 py-5
              bg-gradient-to-r from-emerald-600 to-teal-600
              text-white text-lg
              rounded-xl
              font-semibold
              hover:shadow-xl
              transition-all duration-300
              hover:scale-105
              flex items-center justify-center gap-2">
                <span>Proceed to Checkout</span>
                <ArrowLeft className="rotate-180" size={20} />
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
}