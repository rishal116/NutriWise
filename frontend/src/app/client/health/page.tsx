"use client";

import { useEffect, useState } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import HealthDetailsForm from "@/components/ui/profile/HealthDetailsForm";
import { 
  Activity, 
  Target, 
  Weight, 
  Ruler, 
  TrendingUp, 
  Droplets, 
  Moon, 
  UtensilsCrossed, 
  Calendar,
  Edit3,
  Loader2
} from "lucide-react";

interface HealthDetails {
  height: number;
  weight: number;
  bmi: number;
  activityLevel: string;
  dietType: string;
  dailyWaterIntake: number;
  sleepDuration: string;
  goal: string;
  targetWeight: number;
  preferredTimeline: string;
  focusArea: string;
}

export default function HealthDetailsPage() {
  const [data, setData] = useState<HealthDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    healthDetailsService
      .get()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base font-medium">
            Loading health data...
          </p>
        </div>
      </div>
    );

  if (!data || editing)
    return (
      <HealthDetailsForm
        initialData={data}
        onSuccess={() => {
          setEditing(false);
          healthDetailsService.get().then((res) => setData(res.data));
        }}
      />
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Health Profile
              </h2>
              <p className="text-emerald-50 mt-1 text-sm sm:text-base">
                Track your wellness journey and progress
              </p>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="w-full sm:w-auto px-6 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <Edit3 size={18} />
              Edit Profile
            </button>
          </div>
        </div>

        {/* TOP CARDS - Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <InfoCard 
            title="BMI" 
            value={data.bmi.toFixed(1)} 
            icon={<TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />}
            status={getBMIStatus(data.bmi)}
          />
          <InfoCard 
            title="Goal" 
            value={data.goal} 
            icon={<Target className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />}
          />
          <InfoCard
            title="Target Weight"
            value={`${data.targetWeight} kg`}
            icon={<Weight className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600" />}
          />
        </div>

        {/* SECTIONS */}
        <Section title="Body Metrics" icon={<Ruler className="w-5 h-5" />}>
          <Item 
            label="Height" 
            value={`${data.height} cm`} 
            icon={<Ruler className="w-5 h-5 text-emerald-600" />}
          />
          <Item 
            label="Current Weight" 
            value={`${data.weight} kg`} 
            icon={<Weight className="w-5 h-5 text-emerald-600" />}
          />
          <Item 
            label="BMI Status" 
            value={getBMIStatus(data.bmi)} 
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            highlight={true}
          />
        </Section>

        <Section title="Lifestyle & Activity" icon={<Activity className="w-5 h-5" />}>
          <Item 
            label="Activity Level" 
            value={data.activityLevel} 
            icon={<Activity className="w-5 h-5 text-emerald-600" />}
          />
          <Item
            label="Daily Water Intake"
            value={`${data.dailyWaterIntake} L/day`}
            icon={<Droplets className="w-5 h-5 text-emerald-600" />}
          />
          <Item 
            label="Sleep Duration" 
            value={data.sleepDuration} 
            icon={<Moon className="w-5 h-5 text-emerald-600" />}
          />
        </Section>

        <Section title="Nutrition & Goals" icon={<UtensilsCrossed className="w-5 h-5" />}>
          <Item 
            label="Diet Type" 
            value={data.dietType} 
            icon={<UtensilsCrossed className="w-5 h-5 text-emerald-600" />}
          />
          <Item 
            label="Focus Area" 
            value={data.focusArea} 
            icon={<Target className="w-5 h-5 text-emerald-600" />}
          />
          <Item 
            label="Preferred Timeline" 
            value={data.preferredTimeline} 
            icon={<Calendar className="w-5 h-5 text-emerald-600" />}
          />
        </Section>
      </div>
    </div>
  );
}

/* ---------------- Helper ---------------- */

function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

function getBMIColor(bmi: number): string {
  if (bmi < 18.5) return "text-blue-600";
  if (bmi < 25) return "text-green-600";
  if (bmi < 30) return "text-orange-600";
  return "text-red-600";
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
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {status && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
            {status}
          </span>
        )}
      </div>
      
      <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider font-medium mb-1">
        {title}
      </p>
      <p className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
        {value}
      </p>
    </div>
  );
}