import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

export default function Logo({ size = "md", onClick, className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <div
      onClick={onClick}
      className={`
        flex items-center justify-center 
        rounded-2xl 
        bg-gradient-to-br from-emerald-500 to-teal-600 
        text-white shadow-lg shadow-emerald-200/60 
        transition-all duration-200 
        hover:scale-105 hover:shadow-emerald-300/60
        cursor-pointer
        ${sizeClasses[size]}
        ${className}
      `}
    >
      <span className="text-lg">🍃</span>
    </div>
  );
}