"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // if using Next.js app router
import { Star } from "lucide-react";
import { nutritionistListService } from "@/services/user/nutritionistList.service";

interface NutritionistProfileType {
  id: string;
  name: string;
  expertise: string[];
  rating?: number;
  location?: string;
  bio?: string;
  totalExperienceYears?: number;
  languages?: string[];
  certifications?: string[];
}

export default function NutritionistProfile() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("about");
  const [nutritionist, setNutritionist] = useState<NutritionistProfileType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNutritionist = async () => {
      if (!params?.id) return;
      setLoading(true);
      try {
        const id = Array.isArray(params.id) ? params.id[0] : params.id;
        let response;
        if (id) {
          response = await nutritionistListService.getById(id);
          console.log(response);
        }
       
        setNutritionist(response.data); // Assuming API returns { success: true, data: {...} }
      } catch (error) {
        console.error("Failed to fetch nutritionist", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionist();
  }, [params?.id]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!nutritionist) return <div className="p-8 text-center">Nutritionist not found</div>;

  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed mb-6">{nutritionist.bio || "No bio available"}</p>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Specializations</h3>
              <div className="flex flex-wrap gap-2">
                {nutritionist.expertise?.map((item, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {(nutritionist.certifications?.length ?? 0) > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Certifications</h3>
                <ul className="list-disc list-inside text-gray-700">
                  {nutritionist.certifications?.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {(nutritionist.languages?.length ?? 0) > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Languages</h3>
                <p className="text-gray-700">{nutritionist.languages?.join(", ")}</p>
              </div>
            )}
          </div>
        );

      case "reviews":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((r) => (
                <div key={r} className="border rounded-xl p-4 bg-gray-50">
                  <p className="font-semibold text-gray-900 flex items-center gap-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> 4.{r}
                  </p>
                  <p className="text-gray-700 mt-2">
                    Amazing consultation! Very clear guidance and easy to follow meal plans.
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "availability":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Availability</h2>
            <p className="text-gray-700">Available Slots:</p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {["10:00 AM", "12:00 PM", "2:30 PM", "5:00 PM"].map((slot, i) => (
                <div
                  key={i}
                  className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-center font-medium"
                >
                  {slot}
                </div>
              ))}
            </div>
          </div>
        );

      case "booking":
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Book Appointment</h2>
            <div className="space-y-4">
              <label className="block">
                <span className="text-gray-700 font-medium">Select Date</span>
                <input
                  type="date"
                  className="mt-1 p-3 w-full rounded-xl border border-gray-300"
                />
              </label>

              <label className="block">
                <span className="text-gray-700 font-medium">Select Time</span>
                <input
                  type="time"
                  className="mt-1 p-3 w-full rounded-xl border border-gray-300"
                />
              </label>

              <button className="mt-4 w-full py-4 bg-teal-600 rounded-xl text-white font-bold hover:bg-teal-700 transition">
                Confirm Booking
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-200">
                  <img
                    src="https://i.pravatar.cc/150?img=47"
                    alt={nutritionist.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{nutritionist.name}</h1>
                  <p className="text-gray-600">
                    Registered Dietitian | {nutritionist.totalExperienceYears || "N/A"} years experience
                  </p>
                  <p className="text-gray-600">Location: {nutritionist.location || "N/A"}</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-8 mt-8 border-b border-gray-200">
                {[
                  { key: "about", label: "About" },
                  { key: "reviews", label: "Reviews" },
                  { key: "availability", label: "Availability" },
                  { key: "booking", label: "Book Appointment" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`pb-4 px-1 font-semibold transition ${
                      activeTab === tab.key
                        ? "text-gray-900 border-b-2 border-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content */}
            {renderContent()}
          </div>

          {/* Right Card */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl shadow-sm border border-teal-200 p-6 sticky top-24">
              <button className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold rounded-xl hover:from-teal-600 hover:to-emerald-600 transition shadow-lg hover:shadow-xl mb-4">
                Book Now
              </button>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated cost:</span>
                  <span className="font-semibold text-gray-900">$150</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation:</span>
                  <span className="font-semibold text-gray-900">Online</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
