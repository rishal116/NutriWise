import { ReactNode } from "react";
import GProvider from "@/providers/GProvider";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <GProvider>{children}</GProvider>;
}