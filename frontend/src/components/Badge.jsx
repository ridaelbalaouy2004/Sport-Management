const Badge = ({ children, variant = 'default', size = 'sm', className = '', pulsate = false }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    primary: 'bg-indigo-100 text-indigo-700',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    purple: 'bg-purple-100 text-purple-700',
    teal: 'bg-teal-100 text-teal-700',
    blue: 'bg-blue-100 text-blue-700',
  };
  const sizes = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variants[variant] || 'bg-slate-100 text-slate-600'} ${sizes[size]} ${className}`}
    >
      {pulsate && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
        </span>
      )}
      {children}
    </span>
  );
};

export default Badge;
