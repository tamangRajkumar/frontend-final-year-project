import React from 'react';
import Link from 'next/link';

interface MinimalistLogoProps {
  size?: number;
  variant?: 'full' | 'icon' | 'text-only';
  className?: string;
}

const MinimalistLogo: React.FC<MinimalistLogoProps> = ({ 
  size = 36, 
  variant = 'full',
  className = ''
}) => {
  const brand = '#f26722';
  const brandLight = '#ff8f57';
  
  return (
    <Link href="/">
      <a className={`inline-flex items-center gap-3 group ${className}`} aria-label="LinkCofounders home">
        {/* Minimalist Icon */}
        {variant !== 'text-only' && (
          <div 
            className="relative flex items-center justify-center" 
            style={{ 
              width: size, 
              height: size,
              borderRadius: '8px'
            }}
          >
            <svg 
              width={size} 
              height={size} 
              viewBox="0 0 64 64" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-300 group-hover:scale-110"
            >
              <defs>
                <linearGradient id="minimalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={brand} />
                  <stop offset="100%" stopColor={brandLight} />
                </linearGradient>
              </defs>
              
              {/* Clean background */}
              <rect 
                x="8" y="8" 
                width="48" height="48" 
                rx="8" 
                fill="url(#minimalGradient)"
              />
              
              {/* Geometric connection symbol */}
              <g transform="translate(16, 16)">
                {/* Three connected dots representing network/connection */}
                <circle cx="8" cy="8" r="2.5" fill="white"/>
                <circle cx="24" cy="8" r="2.5" fill="white"/>
                <circle cx="16" cy="24" r="2.5" fill="white"/>
                
                {/* Connection lines */}
                <path 
                  d="M8 8 L16 24 L24 8" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  fill="none"
                  opacity="0.8"
                />
                
                {/* Subtle horizontal connection */}
                <path 
                  d="M10 12 L22 12" 
                  stroke="white" 
                  strokeWidth="1" 
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </g>
            </svg>
          </div>
        )}
        
        {/* Typography */}
        {variant !== 'icon' && (
          <div className="hidden md:block">
            <div 
              className="text-xl font-bold text-gray-900" 
              style={{ 
                letterSpacing: '-0.03em',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
                fontWeight: '700'
              }}
            >
              LinkCofounders
            </div>
            <div 
              className="text-xs text-gray-500 -mt-0.5 font-medium"
              style={{ letterSpacing: '0.1em' }}
            >
              NETWORK • INNOVATE • SUCCEED
            </div>
          </div>
        )}
        
        <style jsx>{`
          .group:hover svg {
            transform: translateY(-1px) rotate(1deg);
          }
          .group:hover .text-xl {
            color: ${brand};
            transition: color 200ms ease;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default MinimalistLogo;


