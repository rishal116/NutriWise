"use client";

import { useEffect, useState } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import HealthDetailsForm from "@/components/ui/profile/HealthDetailsForm";
import { 
  Activity, Target, Weight, Ruler, TrendingUp, Droplets, 
  Moon, UtensilsCrossed, Calendar, Edit3, Loader2 
} from "lucide-react";
import { HealthDetailsPayload } from "@/constants/user/healthDetails.constant";

// 1. Updated Interface to match your API object exactly
interface HealthDetails {
  heightCm: number;
  weightKg: number;
  bmi: number;
  activityLevel: string;
  fitnessLevel: string;
  dietType: string;
  dailyWaterIntakeLiters: number; // Matched to API
  sleepDurationHours: number;    // Matched to API
  goal: string;
  targetWeightKg: number;        // Matched to API
  preferredTimeline: string;
  focusAreas: string[];          // API returns an array
}

export default function HealthDetailsPage() {
  const [data, setData] = useState<HealthDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Helper to format snake_case to Title Case
  const formatLabel = (str: string) => 
    str ? str.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : "N/A";

  const fetchDetails = () => {
    setLoading(true);
    healthDetailsService.getHealthDetails()
      .then((res) => {
      console.log("Health Data:", res.data); // Log the actual data inside the then block
      setData(res.data);
    })
      .catch((err) => console.error("Fetch Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 px-4">
      <div className="text-center">
        <Loader2 className="w-14 h-14 text-emerald-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading health data...</p>
      </div>
    </div>
  );

  if (!data || editing) return (
    <HealthDetailsForm
      initialData={data as HealthDetailsPayload || null }
      onSuccess={() => {
        setEditing(false);
        fetchDetails();
      }}
    />
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white">Health Profile</h2>
              <p className="text-emerald-50 mt-1">Personalized wellness tracking</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Edit3 size={18} /> Edit Profile
            </button>
          </div>
        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard 
            title="BMI" 
            value={data.bmi.toFixed(1)} 
            icon={<TrendingUp className="text-emerald-600" />}
            status={getBMIStatus(data.bmi)}
            bmi={data.bmi}
          />
          <InfoCard 
            title="Current Goal" 
            value={formatLabel(data.goal)} 
            icon={<Target className="text-emerald-600" />}
          />
          <InfoCard
            title="Target Weight"
            value={`${data.targetWeightKg} kg`}
            icon={<Weight className="text-emerald-600" />}
          />
        </div>

        {/* DETAILED SECTIONS */}
        <div className="space-y-6">
          <Section title="Body Metrics" icon={<Ruler />}>
            <Item label="Height" value={`${data.heightCm} cm`} icon={<Ruler className="text-emerald-600" />} />
            <Item label="Weight" value={`${data.weightKg} kg`} icon={<Weight className="text-emerald-600" />} />
            <Item label="BMI Status" value={getBMIStatus(data.bmi)} icon={<TrendingUp className="text-emerald-600" />} highlight />
          </Section>

          <Section title="Lifestyle" icon={<Activity />}>
           <Item label="Fitness Level" value={formatLabel(data.fitnessLevel)} icon={<TrendingUp className="text-emerald-600" />} />
            <Item label="Activity" value={formatLabel(data.activityLevel)} icon={<Activity className="text-emerald-600" />} />
            <Item label="Hydration" value={`${data.dailyWaterIntakeLiters} L/day`} icon={<Droplets className="text-emerald-600" />} />
            <Item label="Sleep" value={`${data.sleepDurationHours} hrs`} icon={<Moon className="text-emerald-600" />} />
          </Section>

          <Section title="Nutrition & Plan" icon={<UtensilsCrossed />}>
            <Item label="Diet" value={formatLabel(data.dietType)} icon={<UtensilsCrossed className="text-emerald-600" />} />
            <Item label="Focus" value={data.focusAreas?.[0] || "General"} icon={<Target className="text-emerald-600" />} />
            <Item label="Timeline" value={data.preferredTimeline.replace('_', ' ')} icon={<Calendar className="text-emerald-600" />} />
          </Section>
        </div>
      </div>
    </div>
  );
}



function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getBMITheme(bmi: number) {
  if (bmi < 18.5) return { text: "text-blue-600", bg: "bg-blue-100", border: "border-blue-200" };
  if (bmi < 25) return { text: "text-emerald-600", bg: "bg-emerald-100", border: "border-emerald-200" };
  if (bmi < 30) return { text: "text-amber-600", bg: "bg-amber-100", border: "border-amber-200" };
  return { text: "text-rose-600", bg: "bg-rose-100", border: "border-rose-200" };
}

/* ---------------- Section ---------------- */

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          {title}
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

/* ---------------- Item ---------------- */

function Item({
  label,
  value,
  icon,
  highlight = false,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl border-2 transition-all ${
      highlight 
        ? "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300" 
        : "bg-gray-50 border-gray-200 hover:border-emerald-300"
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs sm:text-sm font-medium text-gray-600">{label}</p>
      </div>
      <p className={`text-base sm:text-lg font-bold ${
        highlight ? "text-emerald-700" : "text-gray-900"
      }`}>
        {value}
      </p>
    </div>
  );
}

/* ---------------- Info Card ---------------- */

function InfoCard({
  title,
  value,
  icon,
  status,
  bmi, // Pass the raw BMI number here
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: string;
  bmi?: number;
}) {
  // Get the theme based on BMI if it exists, otherwise default to emerald
  const theme = bmi 
    ? getBMITheme(bmi) 
    : { text: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-100" };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
          {icon}
        </div>
        {status && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${theme.bg} ${theme.text} ${theme.border}`}>
            {status}
          </span>
        )}
      </div>
      
      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
        {value}
      </p>
    </div>
  );
}