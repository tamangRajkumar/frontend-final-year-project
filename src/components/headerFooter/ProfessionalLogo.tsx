import React from 'react';
import Link from 'next/link';

interface ProfessionalLogoProps {
  size?: number;
  variant?: 'full' | 'icon' | 'compact';
  className?: string;
}

const ProfessionalLogo: React.FC<ProfessionalLogoProps> = ({ 
  size = 36, 
  variant = 'full',
  className = ''
}) => {
  const brand = '#f26722';
  const brandDark = '#d45a1a';
  const brandLight = '#ff8f57';
  
  return (
    <Link href="/">
      <a className={`inline-flex items-center gap-4 group ${className}`} aria-label="LinkCofounders home">
        {/* Professional Icon */}
        <div 
          className="relative flex items-center justify-center" 
          style={{ 
            width: size, 
            height: size,
            borderRadius: '6px'
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
              <linearGradient id="professionalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={brandDark} />
                <stop offset="50%" stopColor={brand} />
                <stop offset="100%" stopColor={brandLight} />
              </linearGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000000" floodOpacity="0.1"/>
              </filter>
            </defs>
            
            {/* Professional background with shadow */}
            <rect 
              x="2" y="2" 
              width="60" height="60" 
              rx="6" 
              fill="url(#professionalGradient)"
              filter="url(#shadow)"
            />
            
            {/* Corporate connection network */}
            <g transform="translate(12, 12)">
              {/* Main connection nodes */}
              <circle cx="8" cy="8" r="3" fill="white" opacity="0.95"/>
              <circle cx="32" cy="8" r="3" fill="white" opacity="0.95"/>
              <circle cx="20" cy="28" r="3" fill="white" opacity="0.95"/>
              
              {/* Primary connection lines */}
              <path 
                d="M8 8 L20 28 L32 8" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none"
                opacity="0.9"
              />
              
              {/* Secondary connection line */}
              <path 
                d="M11 11 L29 11" 
                stroke="white" 
                strokeWidth="1.5" 
                strokeLinecap="round"
                opacity="0.7"
              />
              
              {/* Accent dots for depth */}
              <circle cx="14" cy="14" r="1" fill="white" opacity="0.6"/>
              <circle cx="26" cy="14" r="1" fill="white" opacity="0.6"/>
            </g>
          </svg>
        </div>
        
        {/* Professional Typography */}
        {variant !== 'icon' && (
          <div className="hidden md:block">
            <div 
              className="text-2xl font-bold text-gray-900" 
              style={{ 
                letterSpacing: '-0.04em',
                fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
                fontWeight: '800'
              }}
            >
              LinkCofounders
            </div>
            <div 
              className="text-sm text-gray-600 -mt-1 font-medium"
              style={{ letterSpacing: '0.05em' }}
            >
              Professional Cofounder Network
            </div>
          </div>
        )}
        
        {/* Compact variant */}
        {variant === 'compact' && (
          <div className="hidden md:block">
            <div 
              className="text-lg font-bold text-gray-900" 
              style={{ 
                letterSpacing: '-0.02em',
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              LinkCofounders
            </div>
          </div>
        )}
        
        <style jsx>{`
          .group:hover svg {
            transform: translateY(-1px);
            filter: drop-shadow(0 4px 8px rgba(242, 103, 34, 0.2));
          }
          .group:hover .text-2xl,
          .group:hover .text-lg {
            color: ${brand};
            transition: color 300ms ease;
          }
        `}</style>
      </a>
    </Link>
  );
};

export default ProfessionalLogo;
