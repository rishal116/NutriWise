import Link from "next/link";
import {
  Flame,
  Stethoscope,
  Users2,
  Calendar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default function DashboardPage() {
  const stats = [
    { label: "Active Challenges", value: "2", icon: Flame, accent: "emerald" },
    { label: "Upcoming Sessions", value: "1", icon: Calendar, accent: "emerald" },
    { label: "Communities Joined", value: "3", icon: Users2, accent: "emerald" },
  ];

  const quickActions = [
    {
      title: "Browse Challenges",
      subtitle: "Join a new wellness challenge",
      href: "/challenges",
      icon: Flame,
    },
    {
      title: "Find a Nutritionist",
      subtitle: "Book a session with a coach",
      href: "/coaching",
      icon: Stethoscope,
    },
    {
      title: "Explore Communities",
      subtitle: "Connect with others on the same path",
      href: "/communities",
      icon: Users2,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-semibold text-slate-900">
          Welcome back 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here&apos;s a quick look at your wellness journey.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex items-center gap-4"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900 leading-none">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Quick actions
          </h2>
          <TrendingUp className="w-4 h-4 text-slate-300" />
        </div>

        <div className="space-y-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-sm transition-all"
              >
                <span className="w-10 h-10 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-slate-900 truncate">
                    {action.title}
                  </span>
                  <span className="block text-xs text-slate-500 truncate mt-0.5">
                    {action.subtitle}
                  </span>
                </span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}