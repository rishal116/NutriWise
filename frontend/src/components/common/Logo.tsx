"use client"
import { useRouter } from "next/navigation";

export default function NutriWiseLogo({ 
  size = "default",
  onClick,
  className = ""
}) {
  const router = useRouter();

  const sizes = {
    small: {
      container: "w-7 h-7",
      icon: "text-lg",
      text: "text-base"
    },
    default: {
      container: "w-9 h-9",
      icon: "text-xl",
      text: "text-xl"
    },
    large: {
      container: "w-11 h-11",
      icon: "text-2xl",
      text: "text-2xl"
    }
  };

  const currentSize = sizes[size];

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push("/home");
    }
  };

  return (
    <div 
      className={`flex items-center gap-2.5 cursor-pointer ${className}`}
      onClick={handleClick}
    >
      <div className={`${currentSize.container} bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm hover:bg-emerald-700 transition-colors`}>
        <span className={`text-white ${currentSize.icon}`}>🍃</span>
      </div>
      <span className={`${currentSize.text} font-semibold text-gray-900`}>
        NutriWise
      </span>
    </div>
  );
}