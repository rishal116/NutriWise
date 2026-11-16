import CheckoutClient from "@/components/user/checkout/CheckoutClient";

interface CheckoutPageProps {
  searchParams: Promise<{
    plan?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const { plan } = await searchParams;

  return <CheckoutClient slug={plan ?? null} />;
}
