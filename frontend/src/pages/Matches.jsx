import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Calendar, Clock } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button, FormField, Input, Select } from '../components/Form';
import { matchesAPI, teamsAPI } from '../services/api';
import { formatDateTime, isUpcoming, statusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_FORM = { home_team_id: '', away_team_id: '', date: '', venue: '', status: 'pending', home_score: 0, away_score: 0 };

const Matches = () => {
  const [matches, setMatches]       = useState([]);
  const [teamsList, setTeamsList]   = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await matchesAPI.getAll();
      setMatches(res.data.data || res.data);
    } catch {
      toast.error('Failed to fetch matches');
    } finally {
      setLoadingMatches(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const res = await teamsAPI.getAll();
      setTeamsList(res.data.data || res.data);
    } catch {
      // silently ignore for dropdowns
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchTeams();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem]   = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [errors, setErrors]       = useState({});
  const [deleteId, setDeleteId]   = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const openCreate = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      home_team_id: item.home_team_id ?? '',
      away_team_id: item.away_team_id ?? '',
      date:         item.date?.slice(0, 16) ?? '',
      venue:        item.venue ?? '',
      status:       item.status ?? 'pending',
      home_score:   item.home_score ?? 0,
      away_score:   item.away_score ?? 0,
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.home_team_id) e.home_team_id = 'Home team is required';
    if (!form.away_team_id) e.away_team_id = 'Away team is required';
    if (form.home_team_id && form.home_team_id === form.away_team_id)
      e.away_team_id = 'Teams must be different';
    if (!form.date) e.date = 'Date and time is required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        home_team_id: Number(form.home_team_id),
        away_team_id: Number(form.away_team_id),
        date:         form.date,
        venue:        form.venue || undefined,
        status:       form.status,
        home_score:   Number(form.home_score),
        away_score:   Number(form.away_score),
      };

      if (editItem) {
        await matchesAPI.update(editItem.id, payload);
        toast.success('Match updated successfully');
      } else {
        await matchesAPI.create(payload);
        toast.success('Match scheduled! Email notification sent to admins.');
      }
      fetchMatches();
      setModalOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save match';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await matchesAPI.delete(deleteId);
      toast.success('Match deleted');
      fetchMatches();
    } catch {
      toast.error('Failed to delete match');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'home_team', label: 'Match',
      render: (v, row) => (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg w-fit ${isUpcoming(row.date) ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50'}`}>
          {isUpcoming(row.date) && <Clock className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />}
          <span className="font-semibold text-slate-800">{v}</span>
          <span className="text-slate-400 font-normal">vs</span>
          <span className="font-semibold text-slate-800">{row.away_team}</span>
        </div>
      ),
    },
    { key: 'sport',  label: 'Sport',  render: (v) => <Badge variant="purple">{v || '—'}</Badge>, hiddenOnMobile: true },
    { key: 'date',   label: 'Date & Time', render: (v) => <span className="text-slate-600 text-sm">{formatDateTime(v)}</span> },
    { key: 'venue',  label: 'Venue',  render: (v) => <span className="text-slate-500 text-sm">{v || '—'}</span>, hiddenOnMobile: true },
    {
      key: 'score', label: 'Score',
      render: (v, row) => (
        <div className="flex items-center gap-1.5 font-mono font-bold text-slate-700">
          <span>{row.home_score}</span>
          <span className="text-slate-300">-</span>
          <span>{row.away_score}</span>
        </div>
      )
    },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <Badge variant={v === 'finished' ? 'success' : v === 'ongoing' ? 'warning' : 'blue'} pulsate={v === 'ongoing'}>
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Badge>
      ),
    },
  ];

  const teamOptions = teamsList.map((t) => ({ value: t.id, label: t.name }));

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Matches</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {matches.filter((m) => isUpcoming(m.date)).length} upcoming ·{' '}
            {matches.filter((m) => !isUpcoming(m.date)).length} completed
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}><Plus className="w-4 h-4" /> Add Match</Button>
      </div>

      {/* Upcoming highlight strip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-blue-800">Upcoming Matches</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {matches.filter((m) => isUpcoming(m.date)).map((m) => (
            <div key={m.id} className="bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm">
              <p className="font-semibold text-slate-800">{m.home_team} vs {m.away_team}</p>
              <p className="text-xs text-slate-400">{formatDateTime(m.date)}</p>
            </div>
          ))}
          {matches.filter((m) => isUpcoming(m.date)).length === 0 && (
            <p className="text-sm text-slate-400">No upcoming matches scheduled</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
        <Table
          columns={columns}
          data={matches}
          loading={loadingMatches}
          searchPlaceholder="Search matches…"
          actions={(row) => (
            <div className="flex items-center gap-2 justify-end">
              <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Match' : 'Schedule Match'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Schedule'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Home Team" required error={errors.home_team_id}>
              <Select id="match-home" value={form.home_team_id} onChange={(e) => setForm({ ...form, home_team_id: e.target.value })} error={errors.home_team_id}>
                <option value="">Select…</option>
                {teamOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </Select>
            </FormField>
            <FormField label="Away Team" required error={errors.away_team_id}>
              <Select id="match-away" value={form.away_team_id} onChange={(e) => setForm({ ...form, away_team_id: e.target.value })} error={errors.away_team_id}>
                <option value="">Select…</option>
                {teamOptions.filter((t) => String(t.value) !== String(form.home_team_id)).map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField label="Date & Time" required error={errors.date}>
            <Input id="match-date" type="datetime-local" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} error={errors.date} />
          </FormField>
          <FormField label="Venue">
            <Input id="match-venue" value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="e.g. City Stadium" />
          </FormField>
          <FormField label="Status">
            <Select id="match-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="pending">Pending</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </Select>
          </FormField>
          {form.status === 'finished' && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50">
              <FormField label="Home Score">
                <Input id="match-home-score" type="number" min="0" value={form.home_score} onChange={(e) => setForm({ ...form, home_score: e.target.value })} />
              </FormField>
              <FormField label="Away Score">
                <Input id="match-away-score" type="number" min="0" value={form.away_score} onChange={(e) => setForm({ ...form, away_score: e.target.value })} />
              </FormField>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Match?"
        message="This will permanently remove the match from the schedule."
      />
    </div>
  );
};

export default Matches;
