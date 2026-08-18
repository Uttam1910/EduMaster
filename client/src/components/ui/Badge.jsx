import React from 'react';

const Badge = ({ children, variant = 'indigo', size = 'sm', className = '' }) => {
  const variants = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    violet: 'bg-violet-50 text-violet-700 border-violet-200/60',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    amber: 'bg-amber-50 text-amber-700 border-amber-200/60',
    rose: 'bg-rose-50 text-rose-700 border-rose-200/60',
    slate: 'bg-slate-100 text-slate-700 border-slate-200/60',
    sky: 'bg-sky-50 text-sky-700 border-sky-200/60',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold',
    sm: 'px-2.5 py-1 text-xs font-medium',
    md: 'px-3 py-1 text-sm font-medium',
  };

  return (
    <span className={`inline-flex items-center rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
