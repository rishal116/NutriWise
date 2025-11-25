import Header from "@/components/user/Header";
import Footer from "@/components/user/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-green-50 min-h-screen">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
