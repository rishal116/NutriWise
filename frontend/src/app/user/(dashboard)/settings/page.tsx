"use client";

import { useRouter } from "next/navigation";
import { Bell, ChevronRight, Lock } from "lucide-react";

const settingsGroups = [
  {
    title: "Account",
    items: [
      {
        icon: Lock,
        label: "Change Password",
        description: "Update your password and keep your account secure.",
        href: "/user/settings/change-password",
        color: "text-emerald-600",
        bgColor: "bg-emerald-50",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        icon: Bell,
        label: "Notifications",
        description: "Manage your notification preferences.",
        href: "/user/notifications",
        color: "text-amber-600",
        bgColor: "bg-amber-50",
      },
    ],
  },
];

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="mx-auto max-w-4xl p-6 lg:p-8">
        <header className="mb-10">
          <h1 className="mb-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-4xl font-bold text-transparent lg:text-5xl">
            Settings
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account security and notification preferences.
          </p>
        </header>

        <div className="space-y-8">
          {settingsGroups.map((group) => (
            <section key={group.title} className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                  {group.title}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent" />
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {group.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => router.push(item.href)}
                      className="group flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-gray-50 sm:px-6"
                    >
                      <div className="flex min-w-0 flex-1 items-start gap-4">
                        <div
                          className={`${item.bgColor} rounded-xl p-3 transition-transform duration-200 group-hover:scale-105`}
                        >
                          <Icon className={item.color} size={20} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 font-semibold text-gray-900 transition-colors group-hover:text-emerald-600">
                            {item.label}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <ChevronRight
                        className="shrink-0 text-gray-400 transition-all group-hover:translate-x-1 group-hover:text-emerald-600"
                        size={20}
                      />
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}