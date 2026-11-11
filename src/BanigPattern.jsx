import React from 'react';

/**
 * Authentic Philippine Banig (Woven Mat) Pattern
 * Features traditional Basey/Samar handwoven colors:
 * Warm natural tikog straw (#e8c98b), terracotta clay (#c05621),
 * golden ochre (#d97706), pandan forest green (#2d6a4f), and heritage wine (#7e2a3a).
 */
export default function BanigPattern({ className = "absolute inset-0 h-full w-full", opacity = 0.16 }) {
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
          {/* Base natural dried buri/tikog reed straw */}
          <rect width="48" height="48" fill="#f8f2e6" />

          {/* Diagonal Weft & Warp Reeds in Authentic Banig Dyes */}
          {/* Forward 45° diagonal woven strands */}
          {/* Straw / Sand reed */}
          <path d="M-12,12 L12,-12 L18,-6 L-6,18 Z" fill="#e8c98b" stroke="#dfba75" strokeWidth="0.5" />
          <path d="M36,60 L60,36 L66,42 L42,66 Z" fill="#e8c98b" stroke="#dfba75" strokeWidth="0.5" />

          {/* Terracotta / Clay reed */}
          <path d="M-6,18 L18,-6 L24,0 L0,24 Z" fill="#c05621" stroke="#a84717" strokeWidth="0.5" />
          <path d="M42,66 L66,42 L72,48 L48,72 Z" fill="#c05621" stroke="#a84717" strokeWidth="0.5" />

          {/* Golden Ochre / Turmeric reed */}
          <path d="M0,24 L24,0 L30,6 L6,30 Z" fill="#d97706" stroke="#b45309" strokeWidth="0.5" />
          <path d="M48,72 L72,48 L78,54 L54,78 Z" fill="#d97706" stroke="#b45309" strokeWidth="0.5" />

          {/* Forest Pandan Green reed */}
          <path d="M6,30 L30,6 L36,12 L12,36 Z" fill="#2d6a4f" stroke="#22533e" strokeWidth="0.5" />
          <path d="M-18,6 L6,-18 L12,-12 L-12,12 Z" fill="#2d6a4f" stroke="#22533e" strokeWidth="0.5" />

          {/* Heritage Wine / Plum reed */}
          <path d="M12,36 L36,12 L42,18 L18,42 Z" fill="#7e2a3a" stroke="#68202d" strokeWidth="0.5" />

          {/* Warm Straw reed */}
          <path d="M18,42 L42,18 L48,24 L24,48 Z" fill="#eed8b1" stroke="#dfba75" strokeWidth="0.5" />

          {/* Terracotta reed */}
          <path d="M24,48 L48,24 L54,30 L30,54 Z" fill="#c05621" stroke="#a84717" strokeWidth="0.5" />

          {/* Golden Ochre reed */}
          <path d="M30,54 L54,30 L60,36 L36,60 Z" fill="#d97706" stroke="#b45309" strokeWidth="0.5" />

          {/* Interlocking cross-plaiting reeds (-45° angle) */}
          <path d="M36,-12 L60,12 L54,18 L30,-6 Z" fill="#e8c98b" stroke="#dfba75" strokeWidth="0.5" opacity="0.65" />
          <path d="M-12,36 L12,60 L6,66 L-18,42 Z" fill="#e8c98b" stroke="#dfba75" strokeWidth="0.5" opacity="0.65" />
          <path d="M30,-6 L54,18 L48,24 L24,0 Z" fill="#2d6a4f" stroke="#22533e" strokeWidth="0.5" opacity="0.65" />
          <path d="M-6,42 L18,66 L12,72 L-12,48 Z" fill="#2d6a4f" stroke="#22533e" strokeWidth="0.5" opacity="0.65" />
          <path d="M24,0 L48,24 L42,30 L18,6 Z" fill="#c05621" stroke="#a84717" strokeWidth="0.5" opacity="0.65" />
          <path d="M0,48 L24,72 L18,78 L-6,54 Z" fill="#c05621" stroke="#a84717" strokeWidth="0.5" opacity="0.65" />
          <path d="M18,6 L42,30 L36,36 L12,12 Z" fill="#d97706" stroke="#b45309" strokeWidth="0.5" opacity="0.65" />
          <path d="M6,54 L30,78 L24,84 L0,60 Z" fill="#d97706" stroke="#b45309" strokeWidth="0.5" opacity="0.65" />
          <path d="M12,12 L36,36 L30,42 L6,18 Z" fill="#7e2a3a" stroke="#68202d" strokeWidth="0.5" opacity="0.65" />
          <path d="M6,18 L30,42 L24,48 L0,24 Z" fill="#eed8b1" stroke="#dfba75" strokeWidth="0.5" opacity="0.65" />
          <path d="M0,24 L24,48 L18,54 L-6,30 Z" fill="#c05621" stroke="#a84717" strokeWidth="0.5" opacity="0.65" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ph-banig-weave)" />
    </svg>
  );
}
