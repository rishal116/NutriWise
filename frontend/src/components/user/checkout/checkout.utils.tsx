
import { IndianRupee } from "lucide-react";

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

interface CurrencyIconProps {
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function CurrencyIcon({
  size,
  className,
  strokeWidth,
}: CurrencyIconProps) {
  return (
    <IndianRupee
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  );
}
