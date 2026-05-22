import { jwtDecode } from "jwt-decode";
import { store } from "@/redux/store";

interface DecodedToken {
  role?: string;
  userId?: string;
  [key: string]: unknown;
}

export const getUserRole = () => {
  try {
    const token = store.getState().auth.token;
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

export const getUserId = () => {
  try {
    const token = store.getState().auth.token;
    if (!token) return null;

    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.userId || null;
  } catch {
    return null;
  }
};