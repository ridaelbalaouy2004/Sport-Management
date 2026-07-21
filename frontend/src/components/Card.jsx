import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const Card = ({ title, value, icon: Icon, color = 'indigo', growth, subtitle }) => {
  const colorMap = {
    indigo: { bg: 'bg-indigo-50', icon: 'bg-indigo-500', text: 'text-indigo-600' },
    emerald: { bg: 'bg-emerald-50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', icon: 'bg-amber-500', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-50', icon: 'bg-purple-500', text: 'text-purple-600' },
    teal: { bg: 'bg-teal-50', icon: 'bg-teal-500', text: 'text-teal-600' },
    rose: { bg: 'bg-rose-50', icon: 'bg-rose-500', text: 'text-rose-600' },
  };
  const c = colorMap[color] || colorMap.indigo;

  const growthNum = parseInt(growth);
  const GrowthIcon = growthNum > 0 ? TrendingUp : growthNum < 0 ? TrendingDown : Minus;
  const growthColor = growthNum > 0 ? 'text-emerald-600' : growthNum < 0 ? 'text-red-500' : 'text-slate-400';

  return (
    <div className="bg-white rounded-2xl p-6 card-shadow-md border border-slate-100 hover:shadow-lg transition-shadow duration-200 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className={`${c.bg} rounded-xl p-3`}>
          {Icon && <Icon className={`${c.text} w-6 h-6`} />}
        </div>
        {growth !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium ${growthColor}`}>
            <GrowthIcon className="w-3.5 h-3.5" />
            <span>{growth}</span>
          </div>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value ?? '—'}</p>
        <p className="text-sm text-slate-500 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default Card;
