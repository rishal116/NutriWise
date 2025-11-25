"use client";

import { ArrowRight } from "lucide-react";

export default function NutritionistCard({ item }: any) {
  const randomName = "Amelia Carter";
  const randomSpec = "Cardiologist";
  const randomRating = (Math.random() * (5 - 4.2) + 4.2).toFixed(1);
  const randomReviews = Math.floor(Math.random() * (240 - 50) + 50);
  const randomYears = Math.floor(Math.random() * 20) + 5;
  const randomAvailability = "Available Today";

  // Random doctor images list
  const doctorImages = [
    "https://cdn-icons-png.flaticon.com/512/3774/3774299.png",
    "https://cdn-icons-png.flaticon.com/512/3870/3870822.png",
    "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
    "https://cdn-icons-png.flaticon.com/512/2922/2922510.png",
    "https://cdn-icons-png.flaticon.com/512/701/701995.png",
    "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    "https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
  ];

  // Pick one random each card
  const randomDoctorImage =
    doctorImages[Math.floor(Math.random() * doctorImages.length)];

  // Always prefix Dr.
  const formatName = (name: string) => {
    if (!name) return `Dr. ${randomName}`;
    return name.toLowerCase().startsWith("dr.") ? name : `Dr. ${name}`;
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex w-full h-40">

      {/* LEFT SECTION */}
      <div className="p-5 flex flex-col justify-between flex-1 space-y-2">

        <span className="inline-block px-3 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
          {item.availability || randomAvailability}
        </span>

        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
          {formatName(item.name)}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          {item.specialization || randomSpec} ·{" "}
          {item.rating || randomRating} ⭐ ({item.reviews || randomReviews} reviews) ·{" "}
          {item.experience || randomYears} yrs experience
        </p>

        {/* View Profile Button */}
        <button
          onClick={() => (window.location.href = `/nutritionists/${item.id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 w-fit"
        >
          View Profile <ArrowRight size={16} />
        </button>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-44 flex-shrink-0 flex items-center justify-center p-4">
        <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-white">
          <img
            src={item.image || randomDoctorImage}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
