import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  subtitle?: string;
  onClick?: () => void;
  className?: string;
  hideSubtitle?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  subtitle = 'VERIFIED NETWORK',
  onClick,
  className = '',
  hideSubtitle = false,
}) => {
  const iconSizes = {
    sm: { box: 'w-8 h-8 rounded-xl', svg: 18, title: 'text-lg', sub: 'text-[8px]' },
    md: { box: 'w-10 h-10 rounded-2xl', svg: 22, title: 'text-xl', sub: 'text-[9.5px]' },
    lg: { box: 'w-12 h-12 rounded-2xl', svg: 26, title: 'text-2xl', sub: 'text-[11px]' },
  };

  const currentSize = iconSizes[size];

  return (
    <div
      onClick={onClick}
      className={`group inline-flex items-center gap-3 select-none transition-all duration-200 ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${className}`}
    >
      {/* Bespoke Premium Brand Mark Icon */}
      <div className="relative shrink-0">
        {/* Ambient subtle backglow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 rounded-2xl blur-[6px] opacity-40 group-hover:opacity-75 transition-opacity duration-300 pointer-events-none" />

        {/* Outer squircle container */}
        <div
          className={`relative ${currentSize.box} flex items-center justify-center bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#0F172A] shadow-md shadow-blue-950/25 border border-white/25 overflow-hidden transition-transform duration-300 group-hover:scale-[1.03]`}
        >
          {/* Top-edge specular glass shine */}
          <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

          {/* Precision Interlocking Briefcase & Connection Nexus Vector */}
          <svg
            width={currentSize.svg}
            height={currentSize.svg}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 text-white drop-shadow-sm"
          >
            {/* Top Handle with refined rounded cap */}
            <path
              d="M9 6V4.5C9 3.67157 9.67157 3 10.5 3H13.5C14.3284 3 15 3.67157 15 4.5V6"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main Outer Shield / Case Structure */}
            <rect
              x="3"
              y="6"
              width="18"
              height="14"
              rx="3.5"
              stroke="white"
              strokeWidth="1.8"
            />
            {/* Dynamic Interlocking "Connect" Hub inside */}
            <path
              d="M3 11.5C6.5 13.5 10 14 12 14C14 14 17.5 13.5 21 11.5"
              stroke="#93C5FD"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Central Verified Lock / Nexus Node */}
            <circle
              cx="12"
              cy="14"
              r="2"
              fill="#FFFFFF"
              stroke="#1D4ED8"
              strokeWidth="1.2"
            />
            {/* Vertical clasp anchor */}
            <path
              d="M12 9V11.8"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Typography: JobConnect Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={`${currentSize.title} font-[800] tracking-[-0.035em] text-slate-900 group-hover:text-black transition-colors`}
          >
            Job
          </span>
          <span
            className={`${currentSize.title} font-[800] tracking-[-0.035em] bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent ml-[-0.5px]`}
          >
            Connect
          </span>
        </div>

        {!hideSubtitle && (
          <div className="flex items-center gap-1.5 mt-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span
              className={`${currentSize.sub} font-[700] tracking-[0.14em] uppercase text-slate-400 group-hover:text-slate-500 transition-colors`}
            >
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
