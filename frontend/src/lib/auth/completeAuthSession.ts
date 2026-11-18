import type { AppDispatch } from "@/redux/store";
import { setAccessToken, setUser } from "@/redux/slices/authSlice";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import { userAuthService } from "@/services/user/userAuth.service";

const ACTIVE_ROLE_COOKIE = "nutriwise_active_role";

export async function completeAuthSession(
  accessToken: string,
  dispatch: AppDispatch,
) {
  // Persist the token before making the /me request.
  tokenStorage.set(accessToken);
  dispatch(setAccessToken(accessToken));

  const response = await userAuthService.getMe(true);

  if (!response.data) {
    tokenStorage.remove();
    dispatch(setAccessToken(null));
    throw new Error("Unable to retrieve your account details.");
  }

  const user = response.data;

  document.cookie = [
    `${ACTIVE_ROLE_COOKIE}=${encodeURIComponent(user.activeRole)}`,
    "Path=/",
    "SameSite=Lax",
    ...(window.location.protocol === "https:" ? ["Secure"] : []),
  ].join("; ");

  dispatch(setUser(user));

  return user;
}
