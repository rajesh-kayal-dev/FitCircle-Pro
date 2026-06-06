import React, { useId } from 'react';

export const Logo = ({ size = "md", className = "" }) => {
  const id = useId();
  const gradId = `metallic-grad-${id.replace(/:/g, '')}`;
  const shadowId = `soft-shadow-${id.replace(/:/g, '')}`;

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
    splash: "w-40 h-40"
  };

  return (
    <svg 
      className={`relative ${sizeClasses[size] || "w-12 h-12"} ${className} drop-shadow-xl`} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#E2E8F0" />
          <stop offset="70%" stopColor="#9CA3AF" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <filter id={shadowId} x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000000" floodOpacity="0.15"/>
        </filter>
      </defs>
      
      <g filter={`url(#${shadowId})`}>
        {/* The C */}
        <path 
          d="M 75 25 A 35 35 0 1 0 75 75" 
          stroke={`url(#${gradId})`}
          strokeWidth="16" 
          strokeLinecap="square"
        />
        {/* The F intersecting the C */}
        <path 
          d="M 35 15 L 35 85 M 35 20 L 75 20 M 35 48 L 65 48" 
          stroke={`url(#${gradId})`}
          strokeWidth="14" 
          strokeLinecap="square"
        />
        {/* Small aesthetic cutout line */}
        <line x1="20" y1="20" x2="80" y2="80" stroke="#F8FAFC" strokeWidth="2" opacity="0.3" style={{ mixBlendMode: 'overlay' }} />
      </g>
    </svg>
  );
};
