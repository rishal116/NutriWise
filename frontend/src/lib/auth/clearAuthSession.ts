
import { logout } from "@/redux/slices/authSlice";
import { store } from "@/redux/store";
import { tokenStorage } from "@/lib/auth/tokenStorage";

const ACTIVE_ROLE_COOKIE = "nutriwise_active_role";

export function clearAuthSession(): void {
  tokenStorage.remove();

  if (typeof document !== "undefined") {
    document.cookie = `${ACTIVE_ROLE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
  }

  store.dispatch(logout());
}
