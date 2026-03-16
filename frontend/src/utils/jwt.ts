import { jwtDecode } from "jwt-decode";
import { store } from "@/redux/store";

export const getUserRole = () => {
  try {
    const token = store.getState().auth.token;
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.role || null;
  } catch {
    return null;
  }
};

export const getUserId = () => {
  try {
    const token = store.getState().auth.token;
    if (!token) return null;

    const decoded: any = jwtDecode(token);
    return decoded.userId || null;
  } catch {
    return null;
  }
};