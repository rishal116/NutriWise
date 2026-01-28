"use client";

import { useEffect, useState } from "react";
import { healthDetailsService } from "@/services/user/healthDetails.service";
import HealthDetailsForm from "@/components/ui/profile/HealthDetailsForm";

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading health data...</p>
        </div>
      </div>
    );

  if (!data || editing)
    return <HealthDetailsForm onSuccess={() => {
      setEditing(false);
      healthDetailsService.get().then((res) => setData(res.data));
    }} initialData={data} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">Health Profile</h2>
              <p className="text-emerald-100">Track your wellness journey</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="px-6 py-3 bg-white text-emerald-600 rounded-2xl font-semibold hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              ✏️ Edit Profile
            </button>
          </div>
        </div>

        {/* Overview Cards with gradient borders */}
        <div className="grid md:grid-cols-3 gap-6">
          <InfoCard title="BMI" value={data.bmi} emoji="📊" color="emerald" />
          <InfoCard title="Goal" value={data.goal} emoji="🎯" color="teal" />
          <InfoCard title="Target Weight" value={`${data.targetWeight} kg`} emoji="⚖️" color="green" />
        </div>

        {/* Body Metrics */}
        <Section title="💪 Body Metrics" color="emerald">
          <Item label="Height" value={`${data.height} cm`} icon="📏" />
          <Item label="Weight" value={`${data.weight} kg`} icon="⚖️" />
          <Item label="BMI Status" value={getBMIStatus(data.bmi)} icon="📈" />
        </Section>

        {/* Lifestyle */}
        <Section title="⚡ Lifestyle" color="teal">
          <Item label="Activity Level" value={data.activityLevel} icon="🏃" />
          <Item label="Water Intake" value={`${data.dailyWaterIntake} L/day`} icon="💧" />
          <Item label="Sleep Duration" value={data.sleepDuration} icon="😴" />
        </Section>

        {/* Nutrition */}
        <Section title="🥗 Nutrition & Focus" color="green">
          <Item label="Diet Type" value={data.dietType} icon="🍽️" />
          <Item label="Focus Area" value={data.focusArea} icon="🎯" />
          <Item label="Timeline" value={data.preferredTimeline} icon="📅" />
        </Section>
      </div>
    </div>
  );
}

/* Helper function */
function getBMIStatus(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
}

/* Components */

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  const gradients = {
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-green-500",
    green: "from-green-500 to-emerald-500"
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gradient-to-r from-emerald-200 to-teal-200">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[color as keyof typeof gradients]} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{title.split(" ")[0]}</span>
          </div>
          <h3 className={`text-xl font-bold bg-gradient-to-r ${gradients[color as keyof typeof gradients]} bg-clip-text text-transparent`}>
            {title}
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-6">{children}</div>
      </div>
    </div>
  );
}

function Item({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="group">
      <div className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-2xl border border-gray-100 hover:border-emerald-200 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{icon}</span>
          <p className="text-sm font-medium text-gray-500">{label}</p>
        </div>
        <p className="text-lg font-bold text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, value, emoji, color }: { title: string; value: string | number; emoji: string; color: string }) {
  const gradients = {
    emerald: "from-emerald-500 to-teal-500",
    teal: "from-teal-500 to-green-500",
    green: "from-green-500 to-emerald-500"
  };

  const textColors = {
    emerald: "text-emerald-600",
    teal: "text-teal-600",
    green: "text-green-600"
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border-2 border-white/50 rounded-3xl shadow-xl p-8 text-center relative overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color as keyof typeof gradients]} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10">
        <div className="text-4xl mb-3">{emoji}</div>
        <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">{title}</p>
        <p className={`text-4xl font-bold ${textColors[color as keyof typeof textColors]} mt-3`}>{value}</p>
      </div>
    </div>
  );
}