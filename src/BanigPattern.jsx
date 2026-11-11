import React from 'react';

/**
 * Authentic Philippine Banig (Woven Mat) Pattern
 * High-contrast transparent base with subtle authentic Basey/Samar tikog reed dyes:
 * Natural tikog straw (#e8c98b), terracotta clay (#c05621), golden ochre (#d97706),
 * pandan green (#2d6a4f), and heritage wine (#7e2a3a).
 */
export default function BanigPattern({ className = "absolute inset-0 h-full w-full", opacity = 0.065 }) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="ph-banig-weave"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          {/* Transparent base — lets pure clean white background show through for maximum text contrast */}

          {/* Forward 45° diagonal woven strands in authentic banig dyes */}
          <path d="M-12,12 L12,-12 L18,-6 L-6,18 Z" fill="#e8c98b" />
          <path d="M36,60 L60,36 L66,42 L42,66 Z" fill="#e8c98b" />

          {/* Terracotta / Clay reed */}
          <path d="M-6,18 L18,-6 L24,0 L0,24 Z" fill="#c05621" />
          <path d="M42,66 L66,42 L72,48 L48,72 Z" fill="#c05621" />

          {/* Golden Ochre / Turmeric reed */}
          <path d="M0,24 L24,0 L30,6 L6,30 Z" fill="#d97706" />
          <path d="M48,72 L72,48 L78,54 L54,78 Z" fill="#d97706" />

          {/* Forest Pandan Green reed */}
          <path d="M6,30 L30,6 L36,12 L12,36 Z" fill="#2d6a4f" />
          <path d="M-18,6 L6,-18 L12,-12 L-12,12 Z" fill="#2d6a4f" />

          {/* Heritage Wine / Plum reed */}
          <path d="M12,36 L36,12 L42,18 L18,42 Z" fill="#7e2a3a" />

          {/* Warm Straw reed */}
          <path d="M18,42 L42,18 L48,24 L24,48 Z" fill="#eed8b1" />

          {/* Terracotta reed */}
          <path d="M24,48 L48,24 L54,30 L30,54 Z" fill="#c05621" />

          {/* Golden Ochre reed */}
          <path d="M30,54 L54,30 L60,36 L36,60 Z" fill="#d97706" />

          {/* Interlocking cross-plaiting reeds (-45° angle) */}
          <path d="M36,-12 L60,12 L54,18 L30,-6 Z" fill="#e8c98b" opacity="0.6" />
          <path d="M-12,36 L12,60 L6,66 L-18,42 Z" fill="#e8c98b" opacity="0.6" />
          <path d="M30,-6 L54,18 L48,24 L24,0 Z" fill="#2d6a4f" opacity="0.6" />
          <path d="M-6,42 L18,66 L12,72 L-12,48 Z" fill="#2d6a4f" opacity="0.6" />
          <path d="M24,0 L48,24 L42,30 L18,6 Z" fill="#c05621" opacity="0.6" />
          <path d="M0,48 L24,72 L18,78 L-6,54 Z" fill="#c05621" opacity="0.6" />
          <path d="M18,6 L42,30 L36,36 L12,12 Z" fill="#d97706" opacity="0.6" />
          <path d="M6,54 L30,78 L24,84 L0,60 Z" fill="#d97706" opacity="0.6" />
          <path d="M12,12 L36,36 L30,42 L6,18 Z" fill="#7e2a3a" opacity="0.6" />
          <path d="M6,18 L30,42 L24,48 L0,24 Z" fill="#eed8b1" opacity="0.6" />
          <path d="M0,24 L24,48 L18,54 L-6,30 Z" fill="#c05621" opacity="0.6" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ph-banig-weave)" />
    </svg>
  );
}
