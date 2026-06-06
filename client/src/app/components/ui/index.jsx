import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = "primary", size = "md", active = false, ...props }, ref) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/20",
    secondary: "bg-slate-800 text-slate-100 border border-slate-700 hover:bg-slate-700",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50",
    danger: "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20",
    outline: "border border-slate-700 bg-transparent text-slate-300 hover:border-slate-500 hover:text-white",
    accent: "bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold",
  };
  
  const sizes = {
    xs: "px-2 py-1 text-[10px]",
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        active && "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950",
        className
      )}
      {...props}
    />
  );
});

export const Card = ({ className, children, hover = false, ...props }) => (
  <div 
    className={cn(
      "bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all", 
      hover && "hover:border-slate-700 hover:translate-y-[-2px]",
      className
    )} 
    {...props}
  >
    {children}
  </div>
);

export const Input = React.forwardRef(({ className, icon: Icon, ...props }, ref) => (
  <div className="relative group w-full">
    {Icon && (
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
    )}
    <input
      ref={ref}
      className={cn(
        "w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 text-sm text-slate-100 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 placeholder:text-slate-600",
        Icon ? "pl-10 pr-4" : "px-4",
        className
      )}
      {...props}
    />
  </div>
));

export const Avatar = ({ src, name, size = "md", className, online = false }) => {
  const sizes = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14",
    xl: "w-20 h-20",
    "2xl": "w-28 h-28",
  };
  
  return (
    <div className="relative inline-block flex-shrink-0">
      <div className={cn("rounded-2xl overflow-hidden border border-slate-800 bg-slate-800 flex items-center justify-center", sizes[size], className)}>
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-bold text-slate-500 bg-slate-800">
            {name?.charAt(0)}
          </div>
        )}
      </div>
      {online && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
      )}
    </div>
  );
};

export const Badge = ({ children, className, variant = "default" }) => {
  const variants = {
    default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    secondary: "bg-slate-800 text-slate-400 border-slate-700",
    outline: "border border-slate-700 text-slate-500",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    accent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};
