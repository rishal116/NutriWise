import { useState, useRef, useEffect } from "react";
import { Bell, User, Settings, LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NutritionistHeader() {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();


  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target))
        setNotifOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const notifications = [
    { id: 1, text: "New client appointment request", time: "5m ago", unread: true },
    { id: 2, text: "Sarah completed her meal plan", time: "1h ago", unread: true },
    { id: 3, text: "Weekly report is ready", time: "2h ago", unread: false },
  ];

  return (
    <header className="h-20 bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-b border-emerald-100 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-sm bg-opacity-80">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
              Dashboard
            </h2>
            <p className="text-xs text-gray-500 -mt-0.5">Welcome back, Dr. Smith</p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-3 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-md group"
          >
            <Bell className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse ring-2 ring-white"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <h3 className="font-semibold text-lg">Notifications</h3>
                <p className="text-xs text-emerald-50 mt-0.5">You have {notifications.filter(n => n.unread).length} unread messages</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 hover:bg-emerald-50/50 transition-colors cursor-pointer ${
                      notif.unread ? "bg-emerald-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {notif.unread && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notif.unread ? "font-medium text-gray-900" : "text-gray-600"}`}>
                          {notif.text}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-gray-50 text-center">
                <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 p-2 pr-4 rounded-2xl hover:bg-white/60 transition-all duration-300 hover:shadow-md group"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-emerald-200 group-hover:ring-emerald-400 transition-all"
                alt="Profile"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800">Dr. Emily Smith</p>
              <p className="text-xs text-gray-500">Nutritionist</p>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white/50"
                    alt="Profile"
                  />
                  <div>
                    <p className="font-semibold">Dr. Emily Smith</p>
                    <p className="text-xs text-emerald-50">emily.smith@clinic.com</p>
                  </div>
                </div>
              </div>

              <div className="py-2">
<button
  onClick={() => router.push("/nutritionist/profile")}
  className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-3 text-gray-700 group"
>
  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
    <User className="h-4 w-4 text-emerald-600" />
  </div>
  <span className="font-medium">My Profile</span>
</button>


                <button className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors flex items-center gap-3 text-gray-700 group">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 flex items-center justify-center group-hover:bg-teal-200 transition-colors">
                    <Settings className="h-4 w-4 text-teal-600" />
                  </div>
                  <span className="font-medium">Settings</span>
                </button>

                <div className="my-2 mx-4 border-t border-gray-100"></div>

                <button className="w-full text-left px-4 py-3 hover:bg-rose-50 transition-colors flex items-center gap-3 text-gray-700 group">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                    <LogOut className="h-4 w-4 text-rose-600" />
                  </div>
                  <span className="font-medium text-rose-600">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}