export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin ${className}`} />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-slate-400">Loading…</p>
    </div>
  </div>
);

export default LoadingSpinner;
