import Link from "next/link";
import { Bell, ChevronRight, Lock, Palette } from "lucide-react";

const settingsGroups = [
  {
    title: "Security",
    items: [
      {
        icon: Lock,
        label: "Change Password",
        description: "Update your password and keep your account secure.",
        href: "/admin/settings/change-password",
        bgColor: "bg-admin-pastel-blue",
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
        href: "/admin/notifications",
        bgColor: "bg-admin-pastel-pink",
      },
      {
        icon: Palette,
        label: "Appearance",
        description: "Customize your dashboard appearance.",
        href: "/admin/settings/appearance",
        bgColor: "bg-admin-pastel-purple",
      },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-admin-text">Settings</h1>
        <p className="text-sm font-medium text-admin-muted">
          Manage your platform settings, account security, and preferences.
        </p>
      </header>

      {settingsGroups.map((group) => (
        <section key={group.title} className="space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-admin-muted">
              {group.title}
            </h2>
            <div className="h-px flex-1 bg-linear-to-r from-admin-border to-transparent" />
          </div>

          <div className="divide-y divide-admin-border overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-sm shadow-admin-text/5">
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group flex items-center justify-between gap-4 px-5 py-5 transition-colors hover:bg-admin-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-accent/60 sm:px-6"
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div
                      className={`${item.bgColor} shrink-0 rounded-xl p-3 transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="text-admin-accent" size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 font-semibold text-admin-text transition-colors group-hover:text-admin-accent">
                        {item.label}
                      </h3>
                      <p className="text-sm text-admin-muted">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className="shrink-0 text-admin-muted transition-all group-hover:translate-x-1 group-hover:text-admin-accent"
                    size={20}
                  />
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}