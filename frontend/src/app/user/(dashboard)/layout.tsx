
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import DashboardShell from "./DashboardShell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <DashboardShell>{children}</DashboardShell>
      <Footer />
    </div>
  );
}
