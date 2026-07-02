"use client";
import Link from "next/link";

type LogoSize = "small" | "default" | "large";

interface LogoProps {
  size?: LogoSize;
  href?: string;
  onClick?: () => void;
  linkable?: boolean;
  className?: string;
}

const sizes: Record<LogoSize, { container: number; text: string }> = {
  small: { container: 28, text: "text-base" },
  default: { container: 36, text: "text-xl" },
  large: { container: 44, text: "text-2xl" },
};

export default function Logo({
  size = "default",
  href = "/",
  onClick,
  linkable = true,
  className = "",
}: LogoProps) {
  const currentSize = sizes[size];

  const content = (
    <div className={`flex items-center gap-2.5 group ${className}`}>
      <svg
        width={currentSize.container}
        height={currentSize.container}
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          width="120"
          height="120"
          rx="28"
          fill="#059669"
          className={linkable ? "transition-colors group-hover:fill-emerald-700" : ""}
        />
        <path
          d="M60 24 C90 24 96 60 96 78 C96 100 80 108 60 108 C40 108 24 100 24 78 C24 60 30 24 60 24 Z"
          fill="white"
        />
        <polyline
          points="34,72 50,72 56,58 66,90 74,66 80,72 90,72"
          fill="none"
          stroke="#059669"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`${currentSize.text} font-semibold text-gray-900`}>
        NutriWise
      </span>
    </div>
  );

  if (!linkable) {
    return content;
  }

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
        aria-label="NutriWise home"
      >
        {content}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
      aria-label="NutriWise home"
    >
      {content}
    </Link>
  );
}