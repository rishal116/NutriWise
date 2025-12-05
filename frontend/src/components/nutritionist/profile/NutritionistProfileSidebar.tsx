"use client"
import { usePathname, useRouter } from "next/navigation";
import { User, Calendar, Clock, Award, Shield, ChevronRight } from "lucide-react";

const menu = [
  { label: "General Info", path: "/nutritionist/profile", icon: User, description: "Personal details and bio" },
  { label: "Consultation Settings", path: "/nutritionist/consultation", icon: Calendar, description: "Session types and pricing" },
  { label: "Availability", path: "/nutritionist/availability", icon: Clock, description: "Working hours and schedule" },
  { label: "Certificates & Licenses", path: "/nutritionist/certificates", icon: Award, description: "Credentials and qualifications" },
  { label: "Account Settings", path: "/nutritionist/settings", icon: Shield, description: "Security and preferences" },
];

export default function ProfileSidebar() {
    const pathname = usePathname();
    const router = useRouter()

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
      <div className="p-4 border-b border-gray-100 mb-2">
        <h3 className="text-lg font-bold text-gray-800">Profile Settings</h3>
        <p className="text-xs text-gray-500 mt-0.5">Manage your professional profile</p>
      </div>

      <nav className="space-y-1.5">
        {menu.map((item) => {
          const active = pathname === item.path;
          const Icon = item.icon;

          return (
<button
  key={item.path}
  onClick={() => router.push(item.path)} // 🚀 REAL NAVIGATION
  className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden
    ${active 
      ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-200" 
      : "hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 text-gray-700"
    }
  `}
>
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-white rounded-r-full shadow-lg"></div>
              )}

              {!active && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              )}

              <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300
                ${active ? "bg-white/20 shadow-inner" : "bg-emerald-100 group-hover:bg-emerald-200 group-hover:scale-110"}
              `}>
                <Icon className={`w-5 h-5 transition-colors duration-300 ${active ? "text-white" : "text-emerald-600"}`} />
              </div>

              <div className="flex-1 min-w-0 relative z-10">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold text-sm transition-all duration-300 ${active ? "translate-x-1" : ""}`}>
                    {item.label}
                  </span>
                  {!active && (
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-emerald-600" />
                  )}
                </div>
                <p className={`text-xs mt-0.5 transition-colors duration-300 ${active ? "text-emerald-50" : "text-gray-500"}`}>
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Progress indicator */}
      <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">Profile Completion</span>
          <span className="text-sm font-bold text-emerald-600">85%</span>
        </div>
        <div className="w-full h-2 bg-white rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500 shadow-lg" style={{ width: '85%' }}></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">Complete all sections to unlock premium features</p>
      </div>
    </div>
  );
}