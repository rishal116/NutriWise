"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Menu,
  ChevronDown,
  LogOut,
  UserRound,
  Settings,
} from "lucide-react";

import type { User as UserType } from "@/types/user/user.types";
import { userAuthService } from "@/services/user/userAuth.service";
import { clearAuthSession } from "@/lib/auth/clearAuthSession";
import NotificationBell from "@/components/notification/NotificationBell";
import Logo from "../common/Logo";

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const getInitials = (fullName?: string): string =>
  fullName
    ?.trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent/60";

const AVATAR_SIZES = {
  sm: { box: "h-9 w-9", pixels: 36 },
  md: { box: "h-10 w-10", pixels: 40 },
} as const;

interface AdminAvatarProps {
  imageUrl: string | null | undefined;
  initials: string;
  size: keyof typeof AVATAR_SIZES;
}

// Shows the profile image, falling back to initials if missing or broken.
function AdminAvatar({ imageUrl, initials, size }: AdminAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const { box, pixels } = AVATAR_SIZES[size];

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-admin-accent text-xs font-bold text-white ${box}`}
    >
      {imageUrl && !hasError ? (
        <Image
          src={imageUrl}
          alt=""
          width={pixels}
          height={pixels}
          unoptimized
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        initials
      )}
    </div>
  );
}

export default function AdminHeader({ onMenuClick }: AdminHeaderProps) {
  const router = useRouter();

  const [adminUser, setAdminUser] = useState<UserType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const adminInitials = getInitials(adminUser?.fullName);

  useEffect(() => {
    let isMounted = true;

    const fetchAdminProfile = async () => {
      try {
        const response = await userAuthService.getMe();

        if (isMounted) {
          setAdminUser(response.data ?? null);
        }
      } catch {
        if (isMounted) {
          router.replace("/login");
        }
      }
    };

    void fetchAdminProfile();

    return () => {
      isMounted = false;
    };
  }, [router]);

  // Attach global listeners only while the dropdown is open.
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isDropdownOpen]);

  const handleLogout = async () => {
    setIsDropdownOpen(false);

    try {
      await userAuthService.logout();
    } catch {
      // Local session is cleared even if the request fails.
    } finally {
      clearAuthSession();
      router.replace("/login");
    }
  };

  const handleProfileNavigation = (path: string) => {
    setIsDropdownOpen(false);
    router.push(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b border-admin-border bg-admin-surface/90 backdrop-blur-md">
      {/* Accent line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-admin-accent to-admin-border"
      />

      <div className="flex h-16 items-center justify-between gap-3 px-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className={`rounded-xl p-2 text-admin-muted transition-colors hover:bg-admin-accent/10 hover:text-admin-accent lg:hidden ${focusRing}`}
          >
            <Menu size={20} />
          </button>

          <div className="flex min-w-0 items-center gap-2.5">
            <Logo size="default" linkable={false} showText />

            <span className="hidden items-center rounded-full bg-admin-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-admin-accent ring-1 ring-inset ring-admin-accent/20 sm:inline-flex">
              Admin
            </span>
          </div>
        </div>

        {/* Notifications and Admin Profile */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <NotificationBell notificationsHref="/admin/notifications" />

          {/* Admin Profile */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() =>
                setIsDropdownOpen((previousState) => !previousState)
              }
              aria-label="Open admin profile menu"
              aria-haspopup="menu"
              aria-expanded={isDropdownOpen}
              aria-controls="admin-profile-menu"
              className={`flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-admin-accent/10 sm:gap-3 sm:pr-3 ${focusRing}`}
            >
              <AdminAvatar
                key={adminUser?.profileImage ?? "none"}
                imageUrl={adminUser?.profileImage}
                initials={adminInitials}
                size="sm"
              />

              <div className="hidden min-w-0 flex-col items-start leading-tight sm:flex">
                <span className="max-w-36 truncate text-xs font-bold text-admin-text">
                  {adminUser?.fullName ?? "Loading..."}
                </span>

                <span className="text-[10px] font-medium uppercase tracking-wide text-admin-accent">
                  {adminUser?.activeRole ?? "Admin"}
                </span>
              </div>

              <ChevronDown
                size={15}
                className={`hidden text-admin-muted transition-transform duration-200 sm:block ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {isDropdownOpen && (
              <div
                id="admin-profile-menu"
                role="menu"
                className="absolute right-0 top-full mt-2 w-60 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-admin-border bg-admin-surface shadow-xl shadow-admin-text/10"
              >
                <div className="flex items-center gap-3 border-b border-admin-border bg-admin-accent/5 px-4 py-3">
                  <AdminAvatar
                    key={adminUser?.profileImage ?? "none"}
                    imageUrl={adminUser?.profileImage}
                    initials={adminInitials}
                    size="md"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-admin-text">
                      {adminUser?.fullName ?? "Admin"}
                    </p>
                    <p className="text-xs text-admin-accent">
                      Administrator
                    </p>
                  </div>
                </div>

                <div className="space-y-1 p-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      handleProfileNavigation("/admin/profile")
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-admin-text transition-colors hover:bg-admin-accent/10 hover:text-admin-accent ${focusRing}`}
                  >
                    <UserRound size={16} />
                    My Profile
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() =>
                      handleProfileNavigation("/admin/settings")
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-admin-text transition-colors hover:bg-admin-accent/10 hover:text-admin-accent ${focusRing}`}
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                </div>

                <div className="border-t border-admin-border p-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-admin-danger transition-colors hover:bg-admin-danger/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-danger/50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}