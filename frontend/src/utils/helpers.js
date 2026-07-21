// ── Date Helpers ────────────────────────────────────────
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const isUpcoming = (dateStr) => dateStr && new Date(dateStr) > new Date();

// ── String Helpers ───────────────────────────────────────
export const initials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export const truncate = (str, length = 30) =>
  str && str.length > length ? str.slice(0, length) + '…' : str;

// ── Number Helpers ───────────────────────────────────────
export const calcWinRate = (wins, total) => {
  if (!total) return 0;
  return Math.round((wins / total) * 100);
};

export const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

// ── Color Helpers ────────────────────────────────────────
export const rankColor = (rank) => {
  if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  if (rank === 2) return 'text-slate-500 bg-slate-50 border-slate-200';
  if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
  return 'text-slate-600 bg-white border-slate-200';
};

export const rankMedal = (rank) => {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return rank;
};

export const statusColor = (status) => {
  const map = {
    active: 'bg-emerald-100 text-emerald-700',
    inactive: 'bg-slate-100 text-slate-600',
    upcoming: 'bg-blue-100 text-blue-700',
    completed: 'bg-purple-100 text-purple-700',
    cancelled: 'bg-red-100 text-red-700',
    ongoing: 'bg-amber-100 text-amber-700',
    pending: 'bg-blue-100 text-blue-700',
    finished: 'bg-indigo-100 text-indigo-700',
  };
  return map[status?.toLowerCase()] || 'bg-slate-100 text-slate-600';
};

export const roleColor = (role) => {
  const map = {
    admin: 'bg-red-100 text-red-700',
    manager: 'bg-indigo-100 text-indigo-700',
    viewer: 'bg-teal-100 text-teal-700',
  };
  return map[role?.toLowerCase()] || 'bg-slate-100 text-slate-600';
};

// ── Sort Helper ──────────────────────────────────────────
export const sortBy = (arr, key, dir = 'asc') => {
  return [...arr].sort((a, b) => {
    const valA = a[key], valB = b[key];
    if (valA === undefined || valA === null) return 1;
    if (valB === undefined || valB === null) return -1;
    const cmp = typeof valA === 'string'
      ? valA.localeCompare(valB)
      : valA - valB;
    return dir === 'asc' ? cmp : -cmp;
  });
};
