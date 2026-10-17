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

function isSafeInternalUrl(url: string): boolean {
  return (
    url.startsWith("/") &&
    !url.startsWith("//") &&
    !url.includes("\\") &&
    !/[\u0000-\u001f]/.test(url)
  );
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

    const parsed: unknown = JSON.parse(raw);

    return isPendingAction(parsed) ? parsed : null;
  } catch (error: unknown) {
    console.error("Failed to read pending action from sessionStorage", error);
    return null;
  }
}

export function redirectToLogin(redirectUrl?: string): void {
  if (typeof window === "undefined") {
    return;
  }

  if (isAuthPage(window.location.pathname)) {
    return;
  }

  const target = redirectUrl || getCurrentUrl();
  const safeTarget = isSafeInternalUrl(target) ? target : "/";

  window.location.href = `/login?redirect=${encodeURIComponent(safeTarget)}`;
}

export function handleUnauthorizedResponse(): void {
  store.dispatch(logout());
  redirectToLogin();
}

function isPendingAction(value: unknown): value is PendingAction {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const action = value as Record<string, unknown>;

  return (
    typeof action.actionKey === "string" &&
    action.actionKey.trim().length > 0 &&
    typeof action.targetUrl === "string" &&
    isSafeInternalUrl(action.targetUrl) &&
    typeof action.timestamp === "number" &&
    Number.isFinite(action.timestamp) &&
    action.timestamp <= Date.now() &&
    Date.now() - action.timestamp <= PENDING_ACTION_TTL_MS
  );
}

export function savePendingAction(
  actionKey: string,
  payload?: unknown,
  targetUrl?: string,
): void {
  if (typeof window === "undefined" || !actionKey.trim()) {
    return;
  }

  const resolvedTarget = targetUrl || getCurrentUrl();

  if (!isSafeInternalUrl(resolvedTarget)) {
    return;
  }

  const pending: PendingAction = {
    actionKey,
    payload,
    targetUrl: resolvedTarget,
    timestamp: Date.now(),
  };

  try {
    sessionStorage.setItem(PENDING_ACTION_STORAGE_KEY, JSON.stringify(pending));
  } catch (error: unknown) {
    console.error("Failed to save pending action to sessionStorage", error);
  }
}
