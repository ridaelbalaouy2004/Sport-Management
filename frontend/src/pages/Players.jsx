import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button, FormField, Input, Select } from '../components/Form';
import { playersAPI, teamsAPI, sportsAPI } from '../services/api';
import { initials, statusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', age: '', position: '', team_id: '', sport_id: '', jersey: '', status: 'active', image: '' };

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [teamsList, setTeamsList] = useState([]);
  const [sportsList, setSportsList] = useState([]);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  const fetchPlayers = async () => {
    setLoadingPlayers(true);
    try {
      const response = await playersAPI.getAll();
      setPlayers(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch players');
    } finally {
      setLoadingPlayers(false);
    }
  };

  const fetchDependencies = async () => {
    try {
      const [teamsRes, sportsRes] = await Promise.all([
        teamsAPI.getAll(),
        sportsAPI.getAll(),
      ]);
      setTeamsList(teamsRes.data.data || teamsRes.data);
      setSportsList(sportsRes.data.data || sportsRes.data);
    } catch (error) {
      // ignore silently for select dropdowns
    }
  };

  useEffect(() => {
    fetchPlayers();
    fetchDependencies();
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [filterTeam, setFilterTeam] = useState('');
  const [filterSport, setFilterSport] = useState('');
  const [view, setView] = useState('table'); // 'table' | 'grid'

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Player name is required';
    if (!form.position.trim()) e.position = 'Position is required';
    if (!form.age || isNaN(form.age) || +form.age < 1) e.age = 'Valid age required';
    if (!form.team_id) e.team_id = 'Team is required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        age: form.age,
        position: form.position,
        team_id: form.team_id,
        sport_id: form.sport_id,
        jersey: form.jersey,
        status: form.status,
        image: form.image || null,
      };

      if (editItem) {
        await playersAPI.update(editItem.id, payload);
        toast.success('Player updated successfully');
      } else {
        await playersAPI.create(payload);
        toast.success('Player added successfully');
      }
      fetchPlayers();
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save player');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await playersAPI.delete(deleteId);
      toast.success('Player deleted');
      fetchPlayers();
    } catch (error) {
      toast.error('Failed to delete player');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // Filter data
  const filtered = players.filter((p) =>
    (!filterTeam || p.team === filterTeam) &&
    (!filterSport || p.sport === filterSport)
  );

  const columns = [
    {
      key: 'name', label: 'Player',
      render: (v, row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img src={row.image} alt={v} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {initials(v)}
            </div>
          )}
          <div>
            <p className="font-medium text-slate-800">{v}</p>
            <p className="text-xs text-slate-400">{row.position}</p>
          </div>
        </div>
      ),
    },
    { key: 'age', label: 'Age', render: (v) => <span className="text-slate-600">{v ?? '—'}</span> },
    { key: 'team', label: 'Team', render: (v) => <Badge variant="primary">{v || '—'}</Badge> },
    { key: 'sport', label: 'Sport', render: (v) => <Badge variant="purple">{v || '—'}</Badge> },
    { key: 'jersey', label: 'Jersey', render: (v) => <span className="font-mono text-slate-600">{v || '—'}</span> },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(v)}`}>{v}</span>
      ),
    },
  ];

  const uniqueTeams = [...new Set(players.map((p) => p.team))].filter(Boolean);
  const uniqueSports = [...new Set(players.map((p) => p.sport))].filter(Boolean);

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Players</h2>
          <p className="text-sm text-slate-500 mt-0.5">{players.length} registered athletes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs font-medium ${view === 'table' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Table</button>
            <button onClick={() => setView('grid')} className={`px-3 py-1.5 text-xs font-medium ${view === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>Cards</button>
          </div>
          <Button variant="primary" onClick={openCreate}>
            <Plus className="w-4 h-4" /> Add Player
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 bg-white p-4 rounded-xl border border-slate-100 card-shadow">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Team:</label>
          <select
            id="player-filter-team"
            value={filterTeam}
            onChange={(e) => setFilterTeam(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">All Teams</option>
            {uniqueTeams.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Sport:</label>
          <select
            id="player-filter-sport"
            value={filterSport}
            onChange={(e) => setFilterSport(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          >
            <option value="">All Sports</option>
            {uniqueSports.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        {(filterTeam || filterSport) && (
          <button
            onClick={() => { setFilterTeam(''); setFilterSport(''); }}
            className="text-xs text-red-500 hover:text-red-700 font-medium px-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {view === 'table' ? (
        <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
          <Table
            columns={columns}
            data={filtered}
            searchPlaceholder="Search players…"
            emptyMessage="No players found with selected filters"
            actions={(row) => (
              <div className="flex items-center gap-2 justify-end">
                <button onClick={() => openEdit(row)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                <button onClick={() => setDeleteId(row.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            )}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((player) => (
            <div key={player.id} className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {player.image ? (
                    <img src={player.image} alt={player.name} className="w-12 h-12 rounded-xl object-cover shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xl font-bold shadow-sm">
                      {initials(player.name)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-800 line-clamp-1">{player.name}</h3>
                    <p className="text-xs text-indigo-600 font-medium">{player.position}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(player)} className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => setDeleteId(player.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Team</span>
                  <span className="font-medium text-slate-700 truncate max-w-[120px]">{player.team || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Sport</span>
                  <span className="font-medium text-slate-700">{player.sport || '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Age</span>
                  <span className="font-medium text-slate-700">{player.age || '—'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                <span className="text-lg font-bold text-slate-300">#{player.jersey || '00'}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusColor(player.status)}`}>
                  {player.status}
                </span>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 italic">No players found matching your criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Player' : 'Add New Player'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {editItem ? 'Save Changes' : 'Add Player'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Full Name" required error={errors.name} className="col-span-2">
              <Input id="player-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Carlos Mendez" error={errors.name} />
            </FormField>
            <FormField label="Age" required error={errors.age}>
              <Input id="player-age" type="number" min="1" max="99" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} placeholder="24" error={errors.age} />
            </FormField>
            <FormField label="Jersey Number">
              <Input id="player-jersey" value={form.jersey} onChange={(e) => setForm({ ...form, jersey: e.target.value })} placeholder="#9" />
            </FormField>
          </div>
          <FormField label="Position" required error={errors.position}>
            <Input id="player-position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} placeholder="e.g. Forward" error={errors.position} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Team" required error={errors.team_id}>
              <Select id="player-team" value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })} error={errors.team_id}>
                <option value="">No team</option>
                {teamsList.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
            </FormField>
            <FormField label="Sport">
              <Select id="player-sport" value={form.sport} onChange={(e) => setForm({ ...form, sport: e.target.value })}>
                <option value="">No sport</option>
                {sportsList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </Select>
            </FormField>
          </div>
          <FormField label="Image URL">
            <Input id="player-image" type="url" placeholder="https://example.com/image.jpg" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </FormField>
          <FormField label="Status">
            <Select id="player-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
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
        title="Delete Player?"
        message="This will permanently remove the player from the system."
      />
    </div>
  );
};

export default Players;
