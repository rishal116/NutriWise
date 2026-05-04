import { useRouter } from "next/navigation";

export default function ANutriWiseLogo() {
  const router = useRouter();

  return (
    <div
      className="flex items-center gap-2.5 cursor-pointer group"
      onClick={() => router.push("/admin/dashboard")}
      role="button"
      aria-label="Go to home"
    >
      {/* Badge */}
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #0d9488, #065f46)",
          boxShadow: "0 4px 14px rgba(13,148,136,0.45)",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 2C7 2 3 6.5 3 10c0 5 4 9 9 9s9-4 9-9c0-3.5-4-8-9-8z"
            fill="rgba(255,255,255,0.15)"
          />
          <path
            d="M12 2c0 0-1 5 2 9s7 5 7 5"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12 2C12 2 9 7 8 11s1 8 1 8"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Wordmark */}
      <span
        className="text-xl sm:text-2xl font-bold tracking-tight select-none"
        style={{
          background: "linear-gradient(90deg, #0d9488, #065f46)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        NutriWise
      </span>
    </div>
  );
}