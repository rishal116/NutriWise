import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-green-50 min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
