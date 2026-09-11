"use client";

import { useEffect, useState } from "react";
import { userAuthService } from "@/services/user/userAuth.service";

const WELCOME_SESSION_KEY = "admin_dashboard_welcome_shown";
const VISIBLE_DURATION = 1600;
const TRANSITION_DURATION = 300;

export default function WelcomeOverlay() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [adminName, setAdminName] = useState("Admin");

  useEffect(() => {
    if (sessionStorage.getItem(WELCOME_SESSION_KEY)) return;

    let cancelled = false;

    const showWelcome = async () => {
      try {
        const response = await userAuthService.getMe();
        if (!cancelled) {
          setAdminName(response.data.fullName?.split(" ")[0] ?? "Admin");
        }
      } catch {
        if (cancelled) return;
      }

      if (cancelled) return;
      sessionStorage.setItem(WELCOME_SESSION_KEY, "true");
      setMounted(true);
      requestAnimationFrame(() => {
        if (!cancelled) setVisible(true);
      });
    };

    showWelcome();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_DURATION);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  useEffect(() => {
    if (!mounted || visible) return;
    const unmountTimer = setTimeout(
      () => setMounted(false),
      TRANSITION_DURATION,
    );
    return () => clearTimeout(unmountTimer);
  }, [mounted, visible]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-admin-bg/90 backdrop-blur-sm transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`px-8 py-6 rounded-2xl bg-admin-surface border border-admin-border shadow-xl transition-all duration-300 ease-out ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <p className="text-lg font-bold text-admin-text tracking-tight">
          Welcome back, {adminName} 👋
        </p>
      </div>
    </div>
  );
}
