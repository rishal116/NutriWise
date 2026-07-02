import { ReactNode } from "react";
import GProviders from "../../providers/providers";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <GProviders>{children}</GProviders>;
}