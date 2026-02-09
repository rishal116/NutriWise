import GProviders from "../providers";
import { ReactNode } from 'react';



export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
          <GProviders>{children}</GProviders>
  );
}
