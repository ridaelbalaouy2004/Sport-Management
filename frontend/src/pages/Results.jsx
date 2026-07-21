import { useState, useEffect } from 'react';
import Table from '../components/Table';
import Badge from '../components/Badge';
import { FormField, Select } from '../components/Form';
import { resultsAPI, sportsAPI } from '../services/api';
import { formatDate, statusColor } from '../utils/helpers';
import toast from 'react-hot-toast';
import { Bell, Pencil, Trash2 } from 'lucide-react';
import Modal from '../components/Modal';
import { Button, Input } from '../components/Form';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

const Results = () => {
  const [results, setResults] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSport, setFilterSport] = useState('');
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ home_score: 0, away_score: 0 });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resData, sportsData] = await Promise.all([
        resultsAPI.getAll(),
        sportsAPI.getAll(),
      ]);
      setResults(resData.data.data || resData.data);
      setSportsList(sportsData.data.data || sportsData.data);
    } catch (error) {
      // toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setSaving(true);
    try {
      await resultsAPI.update(editItem.id, form);
      toast.success('Result updated');
      fetchData();
      setModalOpen(false);
    } catch {
      toast.error('Failed to update result');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await resultsAPI.delete(deleteId);
      toast.success('Result deleted');
      fetchData();
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete result');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      const ongoingMatches = results.filter(r => r.status === 'ongoing');
      if (ongoingMatches.length > 0) {
        ongoingMatches.forEach(m => {
          toast(`${m.match}: ${m.home_score} - ${m.away_score}`, {
            icon: <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>,
            duration: 5000,
            style: { border: '1px solid #f59e0b', background: '#fffbeb', color: '#92400e' }
          });
        });
      }
    }
  }, [results]);

  const filtered = results.filter((r) => !filterSport || r.sport === filterSport);

  const columns = [
    {
      key: 'match', label: 'Match',
      render: (v, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">{v}</span>
          <span className="text-xs text-slate-400 mt-0.5">{formatDate(row.date)}</span>
        </div>
      ),
    },
    { key: 'sport', label: 'Sport', render: (v) => <Badge variant="purple">{v}</Badge>, hiddenOnMobile: true },
    {
      key: 'home_score', label: 'Score',
      render: (v, row) => (
        <div className="flex items-center gap-2 font-mono">
          <span className="text-xl font-bold text-slate-800">{row.home_score}</span>
          <span className="text-slate-400">:</span>
          <span className="text-xl font-bold text-slate-800">{row.away_score}</span>
        </div>
      ),
    },
    {
      key: 'winner', label: 'Winner',
      hiddenOnMobile: true,
      render: (v, row) => (
        row.status !== 'finished' 
          ? <span className="text-slate-400 italic text-xs">In Progress</span>
          : v === 'Draw'
            ? <Badge variant="warning">Draw</Badge>
            : v ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-500 text-sm">🏆</span>
                  <span className="font-semibold text-emerald-700">{v}</span>
                </div>
              ) : <span className="text-slate-300">—</span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <Badge 
          variant={v === 'finished' ? 'success' : v === 'ongoing' ? 'warning' : 'blue'}
          pulsate={v === 'ongoing'}
        >
          {v?.charAt(0).toUpperCase() + v?.slice(1)}
        </Badge>
      ),
    },
  ];

  const sportOptions = sportsList.map((s) => s.name);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Results</h2>
          <p className="text-sm text-slate-500 mt-0.5">{results.length} match results</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Filter:</label>
          <select
            id="results-filter-sport"
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">All Sports</option>
            {sportOptions.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center transform transition hover:scale-[1.02]">
          <p className="text-2xl font-bold text-emerald-600">
            {filtered.filter((r) => r.status === 'finished' && r.winner && r.winner !== 'Draw').length}
          </p>
          <p className="text-sm text-emerald-700 mt-1">Decisive Wins</p>
        </div>
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center transform transition hover:scale-[1.02]">
          <p className="text-2xl font-bold text-amber-600">
            {filtered.filter((r) => r.status === 'finished' && r.winner === 'Draw').length}
          </p>
          <p className="text-sm text-amber-700 mt-1">Finished Draws</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center transform transition hover:scale-[1.02]">
          <p className="text-2xl font-bold text-indigo-600">
            {filtered.filter(r => r.status === 'finished').length}
          </p>
          <p className="text-sm text-indigo-700 mt-1">Completed Matches</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
        <Table
          columns={columns}
          data={filtered}
          searchPlaceholder="Search results…"
          emptyMessage="No results match the selected filter"
          actions={isAdmin ? (row) => (
            <div className="flex items-center gap-2 justify-end">
              <button 
                onClick={() => { setEditItem(row); setForm({ home_score: row.home_score, away_score: row.away_score }); setModalOpen(true); }} 
                className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setDeleteId(row.id)} 
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Result"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate} loading={saving}>Save Changes</Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm font-semibold text-slate-800 text-center mb-2">{editItem?.match}</p>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Home Score">
              <Input type="number" min="0" value={form.home_score} onChange={(e) => setForm({ ...form, home_score: e.target.value })} />
            </FormField>
            <FormField label="Away Score">
              <Input type="number" min="0" value={form.away_score} onChange={(e) => setForm({ ...form, away_score: e.target.value })} />
            </FormField>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Result?"
        message="This will remove the result record. The match status will remain unchanged."
      />
    </div>
  );
};

export default Results;
