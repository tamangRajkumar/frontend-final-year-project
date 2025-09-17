import React from "react";
import Link from "next/link";

const Logo: React.FC<{
  size?: number;
  variant?: "modern" | "minimalist" | "professional";
  hideBranchName?: boolean;
}> = ({ size = 36, variant = "modern", hideBranchName = false }) => {
  const brand = "#f26722";
  const brandLight = "#ff8f57";

  return (
    <Link href="/">
      <a
        className="inline-flex items-center gap-3 group"
        aria-label="LinkCofounders home"
      >
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            width: size,
            height: size,
            borderRadius: "12px",
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="transition-all duration-300 group-hover:scale-105"
          >
            <defs>
              <linearGradient
                id="modernGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor={brand} />
                <stop offset="100%" stopColor={brandLight} />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background with subtle shadow */}
            <rect
              x="4"
              y="4"
              width="56"
              height="56"
              rx="12"
              fill="url(#modernGradient)"
              filter="url(#glow)"
            />

            {/* Modern connection nodes */}
            <circle cx="20" cy="24" r="3" fill="white" opacity="0.9" />
            <circle cx="44" cy="24" r="3" fill="white" opacity="0.9" />
            <circle cx="32" cy="40" r="3" fill="white" opacity="0.9" />

            {/* Clean connection lines */}
            <path
              d="M20 24 L32 40 L44 24"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              opacity="0.9"
            />

            {/* Subtle accent line */}
            <path
              d="M24 28 L40 28"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
          </svg>
        </div>
        {!hideBranchName && (
          <>
            <div className="hidden md:block">
              <div
                className="text-xl font-bold text-gray-900 tracking-tight"
                style={{
                  letterSpacing: "-0.025em",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                LinkCofounders
              </div>
              <div
                className="text-xs text-gray-500 -mt-1 font-medium tracking-wide"
                style={{ letterSpacing: "0.05em" }}
              >
                CONNECT • BUILD • GROW
              </div>
            </div>
          </>
        )}

        <style jsx>{`
          .group:hover svg {
            transform: translateY(-2px) scale(1.02);
          }
          .group:hover .text-xl {
            color: ${brand};
            transition: color 300ms ease;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default Logo;
