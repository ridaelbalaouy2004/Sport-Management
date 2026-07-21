import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Dumbbell } from 'lucide-react';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button, FormField, Input, Select } from '../components/Form';
import { sportsAPI } from '../services/api';
import { statusColor } from '../utils/helpers';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', category: 'Team', status: 'active', description: '', image: '' };

const Sports = () => {
  const [sports, setSports] = useState([]);
  const [loadingSports, setLoadingSports] = useState(true);

  const fetchSports = async () => {
    setLoadingSports(true);
    try {
      const response = await sportsAPI.getAll();
      setSports(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to fetch sports');
    } finally {
      setLoadingSports(false);
    }
  };

  useEffect(() => {
    fetchSports();
  }, []);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setErrors({}); setModalOpen(true); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Sport name is required';
    if (!form.category) e.category = 'Category is required';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (editItem) {
        await sportsAPI.update(editItem.id, form);
        toast.success('Sport updated successfully');
      } else {
        await sportsAPI.create(form);
        toast.success('Sport added successfully');
      }
      fetchSports();
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to save sport');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await sportsAPI.delete(deleteId);
      toast.success('Sport deleted');
      fetchSports();
    } catch (error) {
      toast.error('Failed to delete sport');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name', label: 'Sport',
      render: (v, row) => (
        <div className="flex items-center gap-2.5">
          {row.image ? (
            <img src={row.image} alt={v} className="w-8 h-8 rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-4 h-4 text-indigo-500" />
            </div>
          )}
          <span className="font-medium text-slate-800">{v}</span>
        </div>
      ),
    },
    { key: 'category', label: 'Category', render: (v) => <Badge variant={v === 'Team' ? 'primary' : 'purple'}>{v}</Badge> },
    { key: 'players', label: 'Players', render: (v) => <span className="text-slate-600">{v ?? 0}</span> },
    { key: 'teams', label: 'Teams', render: (v) => <span className="text-slate-600">{v ?? 0}</span> },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(v)}`}>
          {v}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Sports</h2>
          <p className="text-sm text-slate-500 mt-0.5">{sports.length} sports registered</p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Sport
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
        <Table
          columns={columns}
          data={sports}
          searchPlaceholder="Search sports…"
          actions={(row) => (
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => openEdit(row)}
                className="p-1.5 rounded-lg hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 transition-colors"
                title="Edit"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeleteId(row.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editItem ? 'Edit Sport' : 'Add New Sport'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>
              {editItem ? 'Save Changes' : 'Add Sport'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Sport Name" required error={errors.name}>
            <Input
              id="sport-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Football"
              error={errors.name}
            />
          </FormField>

          <FormField label="Category" required error={errors.category}>
            <Select
              id="sport-category"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              error={errors.category}
            >
              <option value="Team">Team</option>
              <option value="Individual">Individual</option>
            </Select>
          </FormField>

          <FormField label="Image URL">
            <Input id="sport-image" type="url" placeholder="https://example.com/image.jpg" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </FormField>

          <FormField label="Status">
            <Select
              id="sport-status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormField>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Sport?"
        message="This will permanently remove the sport and all associated data."
      />
    </div>
  );
};

export default Sports;
