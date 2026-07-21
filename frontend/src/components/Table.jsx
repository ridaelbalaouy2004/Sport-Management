import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

const Table = ({
  columns,           // [{ key, label, render?, sortable?, width? }]
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No records found',
  actions,           // (row) => ReactNode
  onRowClick,
  pageSize = ITEMS_PER_PAGE,
}) => {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  // Filter
  const filtered = data.filter((row) =>
    columns.some((col) => {
      const val = row[col.key];
      return String(val ?? '').toLowerCase().includes(search.toLowerCase());
    })
  );

  // Sort
  const sorted = sortKey
    ? [...filtered].sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        const cmp = typeof va === 'string' ? va.localeCompare(vb) : (va ?? 0) - (vb ?? 0);
        return sortDir === 'asc' ? cmp : -cmp;
      })
    : filtered;

  // Paginate
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key) => {
    if (!key) return;
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('asc'); }
    setPage(1);
  };

  const SortIcon = ({ colKey }) => {
    if (sortKey !== colKey) return <ChevronsUpDown className="w-3.5 h-3.5 text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3.5 h-3.5 text-indigo-500" />
      : <ChevronDown className="w-3.5 h-3.5 text-indigo-500" />;
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Search bar */}
      {searchable && (
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="table-search"
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white card-shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide ${col.hiddenOnMobile ? 'hidden sm:table-cell' : ''} ${col.sortable !== false ? 'cursor-pointer hover:text-slate-700 select-none' : ''}`}
                  style={{ width: col.width }}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {col.sortable !== false && <SortIcon colKey={col.key} />}
                  </div>
                </th>
              ))}
              {actions && <th className="px-4 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                    <span>Loading…</span>
                  </div>
                </td>
              </tr>
            ) : paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-slate-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, idx) => (
                <tr
                  key={row.id ?? idx}
                  className={`border-b border-slate-100 last:border-0 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-slate-50' : 'hover:bg-slate-50/60'}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-slate-700 ${col.hiddenOnMobile ? 'hidden sm:table-cell' : ''}`}>
                      {col.render ? col.render(row[col.key], row) : (row[col.key] ?? '—')}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && sorted.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce((acc, p, i, arr) => {
                if (i > 0 && p - arr[i - 1] > 1) acc.push('…');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="px-2">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium ${p === page ? 'bg-indigo-500 text-white' : 'hover:bg-slate-100 text-slate-600'}`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
