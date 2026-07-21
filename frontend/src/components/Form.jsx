// Generic form field components with consistent styling

export const FormField = ({ label, error, required, children, hint }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-slate-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

const inputBase =
  'w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white';
const inputNormal = 'border-slate-200 focus:ring-indigo-300 focus:border-indigo-400';
const inputError = 'border-red-300 focus:ring-red-300 focus:border-red-400';

export const Input = ({ error, ...props }) => (
  <input
    className={`${inputBase} ${error ? inputError : inputNormal}`}
    {...props}
  />
);

export const Select = ({ error, children, ...props }) => (
  <select
    className={`${inputBase} ${error ? inputError : inputNormal} cursor-pointer`}
    {...props}
  >
    {children}
  </select>
);

export const Textarea = ({ error, rows = 3, ...props }) => (
  <textarea
    rows={rows}
    className={`${inputBase} ${error ? inputError : inputNormal} resize-none`}
    {...props}
  />
);

// Buttons
export const Button = ({ variant = 'primary', size = 'md', loading, children, ...props }) => {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200',
    ghost: 'hover:bg-slate-100 text-slate-600',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-2.5 text-sm',
  };

  return (
    <button
      className={`${variants[variant]} ${sizes[size]} rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
};
