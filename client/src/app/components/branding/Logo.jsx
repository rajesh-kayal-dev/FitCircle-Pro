import React from 'react';

export const Logo = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
    xl: 'w-24 h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} bg-[#0f172a] dark:bg-[#1e293b] rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden group border border-slate-700/50`}>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 group-hover:left-full transition-all duration-1000 ease-in-out pointer-events-none" />
        <div className="relative w-full h-full flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-[60%] h-[60%] text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
            <path d="M12 12v9" />
            <path d="m9 18 3 3 3-3" />
          </svg>
        </div>
      </div>
      {size !== 'xl' && (
        <div className="flex flex-col">
          <span className="font-black tracking-tighter text-slate-900 dark:text-white text-lg uppercase leading-none">
            FitCircle<span className="text-primary italic">Pro</span>
          </span>
          <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-slate-400 leading-none mt-1">Indian Elite</span>
        </div>
      )}
    </div>
  );
};
