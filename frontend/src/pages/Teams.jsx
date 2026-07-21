import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Shield, Users } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button, FormField, Input, Select } from '../components/Form';
import { teamsAPI, sportsAPI } from '../services/api';
import { statusColor, calcWinRate } from '../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', sport: '', sport_id: '', coach: '', status: 'active', image: '' };

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const fetchTeams = async () => {
    setLoadingTeams(true);
    try {
      const response = await teamsAPI.getAll();
      setTeams(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch teams');
    } finally {
      setLoadingTeams(false);
    }
  };

  const fetchSports = async () => {
    try {
      const response = await sportsAPI.getAll();
      setSportsList(response.data.data || response.data);
    } catch (error) {
      // ignore silently for select dropdown
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchSports();
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState('table'); // 'table' | 'grid'

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Team name is required';
    if (!form.sport_id) e.sport_id = 'Sport is required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        sport_id: form.sport_id,
        coach: form.coach,
        status: form.status,
        image: form.image || null,
      };

      if (editItem) {
        await teamsAPI.update(editItem.id, payload);
        toast.success('Team updated successfully');
      } else {
        await teamsAPI.create(payload);
        toast.success('Team added successfully');
      }
      fetchTeams();
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save team');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await teamsAPI.delete(deleteId);
      toast.success('Team deleted');
      fetchTeams();
    } catch (error) {
      toast.error('Failed to delete team');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Team',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt={v} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-white" />
            </div>
          )}
          <div>
            <p className="font-semibold text-slate-800">{v}</p>
            <p className="text-xs text-slate-400">{row.coach || 'No coach'}</p>
          </div>
        </div>
      ),
    },
    { key: 'sport', label: 'Sport', render: (v) => <Badge variant="purple">{v || '—'}</Badge> },
    { key: 'players', label: 'Players', render: (v, row) => <div className="flex items-center gap-1 text-slate-600"><Users className="w-3.5 h-3.5" />{v ?? 0}</div> },
    { key: 'wins', label: 'W', render: (v) => <span className="text-emerald-600 font-semibold">{v ?? 0}</span> },
    { key: 'losses', label: 'L', render: (v) => <span className="text-red-500 font-semibold">{v ?? 0}</span> },
    { key: 'draws', label: 'D', render: (v) => <span className="text-amber-500 font-semibold">{v ?? 0}</span> },
    {
      key: 'wins', label: 'Win Rate', sortable: false,
      render: (v, row) => {
        const total = (row.wins ?? 0) + (row.losses ?? 0) + (row.draws ?? 0);
        const rate = calcWinRate(row.wins, total);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${rate}%` }} />
            </div>
            <span className="text-xs text-slate-500">{rate}%</span>
          </div>
        );
      },
    },
    {
      key: 'status', label: 'Status',
      render: (v) => <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(v)}`}>{v}</span>,
    },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Teams</h2>
          <p className="text-sm text-slate-500 mt-0.5">{teams.length} registered teams</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs font-medium ${view === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Table</button>
            <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-xs font-medium ${view === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Cards</button>
          </div>
          <Button variant="primary" onClick={openCreate}><Plus className="w-4 h-4" /> Add Team</Button>
        </div>
      </div>

      {view === 'table' ? (
        <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
          <Table
            columns={columns}
            data={teams}
            searchPlaceholder="Search teams…"
            actions={(row) => (
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team) => {
            const total = (team.wins ?? 0) + (team.losses ?? 0) + (team.draws ?? 0);
            const rate = calcWinRate(team.wins, total);
            return (
              <div key={team.id} className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {team.image ? (
                      <img src={team.image} alt={team.name} className="w-11 h-11 rounded-xl object-cover" />
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-800">{team.name}</h3>
                      <p className="text-xs text-slate-400">{team.sport}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(team)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => setDeleteId(team.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mb-3">Coach: {team.coach || 'N/A'}</p>
                <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                  <div className="bg-emerald-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-emerald-600">{team.wins ?? 0}</p>
                    <p className="text-xs text-slate-400">Wins</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-red-500">{team.losses ?? 0}</p>
                    <p className="text-xs text-slate-400">Losses</p>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2">
                    <p className="text-lg font-bold text-amber-500">{team.draws ?? 0}</p>
                    <p className="text-xs text-slate-400">Draws</p>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Win Rate</span>
                    <span className="font-semibold text-indigo-600">{rate}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${rate}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Team' : 'Add New Team'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Add Team'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Team Name" required error={errors.name}>
            <Input id="team-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Thunder Hawks" error={errors.name} />
          </FormField>
          <FormField label="Sport" required error={errors.sport_id}>
            <Select id="team-sport" value={form.sport_id} onChange={(e) => setForm({ ...form, sport_id: e.target.value })} error={errors.sport_id}>
              <option value="">Select sport…</option>
              {sportsList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </Select>
          </FormField>
          <FormField label="Coach">
            <Input id="team-coach" value={form.coach} onChange={(e) => setForm({ ...form, coach: e.target.value })} placeholder="e.g. Spain" />
          </FormField>
          <FormField label="Image URL">
            <Input id="team-image" type="url" placeholder="https://example.com/image.jpg" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <Select id="team-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Team?"
        message="This will permanently remove the team and related data."
      />
    </div>
  );
};

export default Teams;
