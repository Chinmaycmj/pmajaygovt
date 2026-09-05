import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  size = 'md',
  animated = true,
  className = '',
}) => {
  const dimensionMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  const dim = dimensionMap[size];

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Outer Radiant Glow Rings */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-orange-500/20 to-emerald-500/30 blur-xl ${
          animated ? 'animate-pulse' : ''
        }`}
      />

      {/* SVG Emblem Graphic */}
      <svg
        className={`${dim} relative drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)] transition-transform duration-300 hover:scale-105`}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Golden metallic gradient */}
          <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF2B2" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="60%" stopColor="#D97706" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Saffron & Orange gradient for audio rays */}
          <linearGradient id="saffronGlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>

          {/* Emerald Jade gradient */}
          <linearGradient id="emeraldJade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>

          {/* Royal Navy gradient */}
          <linearGradient id="royalNavy" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Acoustic Wave Filter */}
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Circular Soundwave Rings */}
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke="url(#goldMetallic)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          stroke="url(#saffronGlow)"
          strokeWidth="1.8"
          opacity="0.9"
        />

        {/* Inner Shield / Seal Disc */}
        <circle
          cx="50"
          cy="50"
          r="37"
          fill="url(#royalNavy)"
          stroke="url(#goldMetallic)"
          strokeWidth="2.5"
        />

        {/* Concentric Tricolor Sound Aura Ring */}
        <circle
          cx="50"
          cy="50"
          r="32"
          stroke="url(#emeraldJade)"
          strokeWidth="1.5"
          opacity="0.75"
        />

        {/* Ashoka Chakra 24 Radiating Spokes (Stylized Audio Frequency Rays) */}
        <g opacity="0.45">
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + 29 * Math.cos((angle * Math.PI) / 180)}
                y2={50 + 29 * Math.sin((angle * Math.PI) / 180)}
                stroke="#FCD34D"
                strokeWidth="0.75"
              />
            );
          })}
        </g>

        {/* Decorative Golden Wheat / Laurel Ears (Livelihood & Abhyuday Symbol) */}
        {/* Left Laurel */}
        <path
          d="M 22 56 C 21 44, 28 32, 36 26"
          stroke="url(#goldMetallic)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="21" cy="50" r="1.8" fill="#FBBF24" />
        <circle cx="24" cy="40" r="1.8" fill="#FBBF24" />
        <circle cx="30" cy="32" r="1.8" fill="#FBBF24" />

        {/* Right Laurel */}
        <path
          d="M 78 56 C 79 44, 72 32, 64 26"
          stroke="url(#goldMetallic)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />
        <circle cx="79" cy="50" r="1.8" fill="#FBBF24" />
        <circle cx="76" cy="40" r="1.8" fill="#FBBF24" />
        <circle cx="70" cy="32" r="1.8" fill="#FBBF24" />

        {/* Center: Glowing Microphone & Acoustic Voice Crystal */}
        <g filter="url(#softGlow)">
          {/* Mic Capsule */}
          <rect
            x="44"
            y="30"
            width="12"
            height="22"
            rx="6"
            fill="url(#goldMetallic)"
            stroke="#FFF2B2"
            strokeWidth="1"
          />
          {/* Inner mesh lines */}
          <line x1="47" y1="36" x2="53" y2="36" stroke="#78350F" strokeWidth="1" />
          <line x1="47" y1="41" x2="53" y2="41" stroke="#78350F" strokeWidth="1" />
          <line x1="47" y1="46" x2="53" y2="46" stroke="#78350F" strokeWidth="1" />

          {/* Mic Cradle / Arc */}
          <path
            d="M 39 44 C 39 54, 61 54, 61 44"
            stroke="url(#goldMetallic)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Mic Stem */}
          <line x1="50" y1="54" x2="50" y2="62" stroke="url(#goldMetallic)" strokeWidth="2.5" />
          {/* Mic Base */}
          <path
            d="M 42 62 L 58 62"
            stroke="url(#goldMetallic)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Dynamic Acoustic Sound Waves Expanding from Mic */}
        <path
          d="M 33 40 C 31 46, 31 50, 33 56"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 28 36 C 25 45, 25 55, 28 64"
          stroke="#10B981"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M 67 40 C 69 46, 69 50, 67 56"
          stroke="#38BDF8"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M 72 36 C 75 45, 75 55, 72 64"
          stroke="#10B981"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />

        {/* Lower Banner Ribbon: "सत्यमेव जयते" / Ashoka Lions Star */}
        <g>
          <path
            d="M 28 72 Q 50 78 72 72 L 75 80 Q 50 86 25 80 Z"
            fill="url(#goldMetallic)"
            stroke="#FFF2B2"
            strokeWidth="0.8"
          />
          {/* Center Jewel Star */}
          <polygon
            points="50,75 52,78 55,78 53,80 54,83 50,81 46,83 47,80 45,78 48,78"
            fill="#0F172A"
          />
        </g>
      </svg>
    </div>
  );
};
