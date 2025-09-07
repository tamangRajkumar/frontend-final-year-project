import React from 'react';
import Link from 'next/link';

const Logo: React.FC<{ size?: number }> = ({ size = 36 }) => {
  const brand = '#f26722';
  return (
    <Link href="/">
      <a className="inline-flex items-center gap-3 group" aria-label="LinkCofounders home">
        <div className="rounded-full flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="g" x1="0" x2="1">
                <stop offset="0" stopColor="#f26722" />
                <stop offset="1" stopColor="#ff8f57" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="64" height="64" rx="14" fill="url(#g)" />
            <path d="M20 40 L32 24 L44 40" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M24 36 L40 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
        <div className="hidden md:block">
          <div className="text-lg font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>LinkCofounders</div>
          <div className="text-xs text-gray-600 -mt-1">Find your cofounder faster</div>
        </div>
        <style jsx>{`
          .group svg{ transition: transform 300ms ease; }
          .group:hover svg{ transform: translateY(-3px) rotate(-4deg); }
        `}</style>
      </a>
    </Link>
  );
};

export default Logo;
