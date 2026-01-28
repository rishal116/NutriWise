"use client";

import { Lock, ChevronRight, Bell, Shield, UserX, Globe, Moon, HelpCircle, Mail, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();

  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: Lock,
          label: "Change Password",
          description: "Update your password and security settings",
          onClick: () => router.push("/change-password"),
          color: "text-emerald-600",
          bgColor: "bg-emerald-50"
        },
        {
          icon: Mail,
          label: "Email Preferences",
          description: "Manage your email and communication settings",
          onClick: () => {},
          color: "text-teal-600",
          bgColor: "bg-teal-50"
        },
        {
          icon: Smartphone,
          label: "Two-Factor Authentication",
          description: "Add an extra layer of security",
          onClick: () => {},
          color: "text-cyan-600",
          bgColor: "bg-cyan-50",
          badge: "Recommended"
        }
      ]
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Bell,
          label: "Notifications",
          description: "Configure push and email notifications",
          onClick: () => {},
          color: "text-amber-600",
          bgColor: "bg-amber-50"
        },
        {
          icon: Globe,
          label: "Language & Region",
          description: "Set your language and timezone",
          onClick: () => {},
          color: "text-blue-600",
          bgColor: "bg-blue-50"
        },
        {
          icon: Moon,
          label: "Appearance",
          description: "Customize theme and display options",
          onClick: () => {},
          color: "text-purple-600",
          bgColor: "bg-purple-50"
        }
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: Shield,
          label: "Privacy Settings",
          description: "Control your data and privacy options",
          onClick: () => {},
          color: "text-indigo-600",
          bgColor: "bg-indigo-50"
        }
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help and contact support",
          onClick: () => {},
          color: "text-slate-600",
          bgColor: "bg-slate-50"
        }
      ]
    },
    {
      title: "Danger Zone",
      items: [
        {
          icon: UserX,
          label: "Delete Account",
          description: "Permanently delete your account and data",
          onClick: () => {},
          color: "text-red-600",
          bgColor: "bg-red-50"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto p-6 lg:p-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
            Settings
          </h1>
          <p className="text-gray-600 text-lg">
            Manage your account preferences and settings
          </p>
        </div>

        {/* Settings Groups */}
        <div className="space-y-8">
          {settingsGroups.map((group) => (
            <div key={group.title} className="space-y-4">
              {/* Group Title */}
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  {group.title}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
              </div>

              {/* Group Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                {group.items.map((item, index) => (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className={`
                      w-full flex items-center justify-between px-6 py-5 
                      hover:bg-gray-50 transition-all duration-200 group
                      ${index !== group.items.length - 1 ? 'border-b border-gray-100' : ''}
                    `}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Icon */}
                      <div className={`${item.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform duration-200`}>
                        <item.icon className={item.color} size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight 
                      className="text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-4" 
                      size={20}
                    />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team anytime.</p>
        </div>
      </div>
    </div>
  );
}