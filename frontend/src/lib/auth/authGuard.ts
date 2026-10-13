import { store } from "@/redux/store";
import { logout } from "@/redux/slices/authSlice";

export interface PendingAction {
  actionKey: string;
  payload?: unknown;
  targetUrl: string;
  timestamp: number;
}

const PENDING_ACTION_STORAGE_KEY = "nutriwise_pending_action";

const PENDING_ACTION_TTL_MS = 15 * 60 * 1000;

const AUTH_PAGES = [
  "/login",
  "/signup",
  "/verify-otp",
  "/forgot-password",
  "/reset-password",
];

export function isAuthPage(pathname: string): boolean {
  return AUTH_PAGES.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`),
  );
}

export function getCurrentUrl(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname + window.location.search;
}

export function savePendingAction(
  actionKey: string,
  payload?: unknown,
  targetUrl?: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const pending: PendingAction = {
    actionKey,
    payload,
    targetUrl: targetUrl || getCurrentUrl(),
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, JSON.stringify(pending));
  } catch (error) {
    console.error("Failed to save pending action to sessionStorage", error);
  }
}

export function getAndClearPendingAction(): PendingAction | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(PENDING_ACTION_STORAGE_KEY);

    if (!raw) {
      return null;
    }

    sessionStorage.removeItem(PENDING_ACTION_STORAGE_KEY);

    const pending: PendingAction = JSON.parse(raw);

    if (Date.now() - pending.timestamp > PENDING_ACTION_TTL_MS) {
      return null;
    }

    return pending;
  } catch (error) {
    console.error("Failed to parse pending action from sessionStorage", error);

    return null;
  }
}

export function redirectToLogin(redirectUrl?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentPath = window.location.pathname;

  if (isAuthPage(currentPath)) {
    return;
  }

  const target = redirectUrl || getCurrentUrl();

  const loginUrl = `/login?redirect=${encodeURIComponent(target)}`;

  window.location.href = loginUrl;
}

export function handleUnauthorizedResponse(): void {
  store.dispatch(logout());

  redirectToLogin();
}
