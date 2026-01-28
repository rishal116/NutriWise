"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MessageCircle, CreditCard, Star, MapPin, Award, Users, Activity, Calendar, TrendingUp, CheckCircle, ArrowLeft } from "lucide-react";
import { nutritionistListService } from "@/services/user/nutritionistList.service";
import BreadcrumbHeader from "@/components/ui/nutritionists/BreadcrumbHeader";
import { NutritionistProfileDTO} from "@/constants/nutritionistProfile.constants";
import { useRouter } from "next/navigation";

export default function NutritionistProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<NutritionistProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reviews" | "about">("about");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await nutritionistListService.getById(id as string);
        setProfile(data);
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent mb-4"></div>
          <p className="text-emerald-700 font-semibold">Loading profile...</p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <Star className="text-red-600" size={40} />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-2">Nutritionist not found</p>
          <button
            onClick={() => router.back()}
            className="text-emerald-600 hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );

  const stats = [
    { icon: Star, label: "Rating", value: `${profile.rating?.toFixed(1) || 0}/5`, color: "text-amber-600", bgColor: "bg-amber-50" },
    { icon: Users, label: "Clients Coached", value: profile.totalPeopleCoached || 0, color: "text-blue-600", bgColor: "bg-blue-50" },
    { icon: Activity, label: "Experience", value: `${profile.totalExperienceYears || 0} Years`, color: "text-purple-600", bgColor: "bg-purple-50" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors mb-4 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back</span>
          </button>
          
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Nutritionist Profile
          </h1>
          <BreadcrumbHeader
            title=""
            crumbs={[
              { label: "Home", href: "/home" },
              { label: "Get a Coach", href: "/coaching" },
              { label: "Nutritionists", href: "#" },
              { label: profile.fullName },
            ]}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-white mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5"></div>
          
          <div className="relative p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              {/* LEFT: Image + Info */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 flex-1">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur opacity-25"></div>
                  <img
                    src={profile.profileImage || "/images/images.jpg"}
                    className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full border-4 border-white shadow-2xl object-cover"
                    alt={profile.fullName}
                  />
                  {profile.nutritionistStatus === "TOP_COACH" && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full p-2 shadow-lg">
                      <Award className="text-white" size={20} />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row items-center gap-3 mb-2">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {profile.fullName}
                    </h2>
                    <span className={`px-4 py-1.5 text-xs font-bold rounded-full shadow-sm ${
                      profile.nutritionistStatus === "TOP_COACH"
                        ? "bg-gradient-to-r from-amber-400 to-orange-500 text-white"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {profile.nutritionistStatus === "TOP_COACH" ? "⭐ TOP COACH" : profile.nutritionistStatus}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 font-medium mb-4">
                    Certified Nutrition Coach
                  </p>

                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
                    {stats.map((stat) => (
                      <div key={stat.label} className="flex items-center gap-2">
                        <div className={`${stat.bgColor} p-2 rounded-lg`}>
                          <stat.icon className={stat.color} size={16} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs text-gray-500">{stat.label}</p>
                          <p className="text-sm font-bold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* RIGHT: Action Buttons */}
              <div className="flex flex-col gap-3 w-full sm:w-auto">
                <Link
                  href={`/coaching/${id}/plans`}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <CreditCard size={20} />
                  <span>View Plans</span>
                </Link>

                <button className="flex items-center justify-center gap-2 bg-white border-2 border-emerald-200 text-emerald-700 px-8 py-4 rounded-xl font-semibold hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300">
                  <MessageCircle size={20} />
                  <span>Start Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">
            {/* Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                Professional Details
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <MapPin className="text-emerald-600 flex-shrink-0 mt-0.5" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="font-semibold text-gray-900">{profile.country}</p>
                  </div>
                </div>

                {profile.qualifications.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Award className="text-teal-600 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Qualifications</p>
                      <p className="font-semibold text-gray-900">{profile.qualifications.join(", ")}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-xs text-gray-500 mb-3 font-semibold">Specializations</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.specializations.map((s) => (
                      <span
                        key={s}
                        className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-6 rounded-2xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp size={20} />
                Success Highlights
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span className="text-sm">{profile.totalPeopleCoached || 0}+ clients transformed</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span className="text-sm">{profile.totalExperienceYears || 0} years of expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} />
                  <span className="text-sm">{profile.rating?.toFixed(1) || 0}/5 average rating</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* TABS */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab("about")}
                  className={`flex-1 px-8 py-4 font-semibold transition-all ${
                    activeTab === "about"
                      ? "bg-white border-b-2 border-emerald-600 text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  About Me
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 px-8 py-4 font-semibold transition-all ${
                    activeTab === "reviews"
                      ? "bg-white border-b-2 border-emerald-600 text-emerald-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Reviews
                </button>
              </div>

              {/* TAB CONTENT */}
              <div className="p-8">
                {activeTab === "about" ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <div className="w-1 h-8 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>
                        About {profile.fullName.split(' ')[0]}
                      </h3>
                      <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                          {profile.bio || "No bio available yet. This nutritionist is building their profile."}
                        </p>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {profile.bio && (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mt-8">
                        <h4 className="font-bold text-emerald-900 mb-3 flex items-center gap-2">
                          <Calendar size={18} />
                          Ready to start your journey?
                        </h4>
                        <p className="text-emerald-800 text-sm mb-4">
                          Book a consultation with {profile.fullName.split(' ')[0]} and get personalized nutrition guidance tailored to your goals.
                        </p>
                        <Link
                          href={`/coaching/${id}/plans`}
                          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition"
                        >
                          <CreditCard size={18} />
                          View Available Plans
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                      <Star className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Reviews Yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {profile.fullName.split(' ')[0]} is building their reputation. Be the first to work with them and leave a review!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}