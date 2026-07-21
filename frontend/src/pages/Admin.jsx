import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ShieldAlert } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import Table from '../components/Table';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import ConfirmDialog from '../components/ConfirmDialog';
import { Button, FormField, Input, Select } from '../components/Form';
import { MOCK_USERS, ROLES, ROUTES } from '../utils/constants';
import { formatDate, roleColor, statusColor, initials } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../services/api';
import toast from 'react-hot-toast';

const EMPTY_FORM = { name: '', email: '', role: 'viewer', password: '', status: 'active', image: null };

const Admin = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Guard
  if (!isAdmin()) return <Navigate to={ROUTES.DASHBOARD} replace />;

  const openCreate = () => { setEditItem(null); setForm(EMPTY_FORM); setErrors({}); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm({ ...item, password: '' }); setErrors({}); setModalOpen(true); };

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getAll();
      setUsers(response.data.data || response.data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    if (isAdmin()) fetchUsers();
  }, [isAdmin]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!editItem && !form.password) e.password = 'Password required for new user';
    if (form.password && form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    
    try {
      const payload = {
        name: form.name,
        email: form.email,
        role: form.role,
        image: form.image || null,
      };
      if (form.password) payload.password = form.password;

      if (editItem) {
        await usersAPI.update(editItem.id, payload);
        toast.success('User updated successfully');
      } else {
        await usersAPI.create(payload);
        toast.success('User created successfully');
      }
      fetchUsers();
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await usersAPI.delete(deleteId);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      key: 'name', label: 'User',
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
            <p className="font-semibold text-slate-800">{v}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role', label: 'Role',
      render: (v) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${roleColor(v)}`}>{v}</span>
      ),
    },
    {
      key: 'status', label: 'Status',
      render: (v) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor(v)}`}>{v}</span>
      ),
    },
    { key: 'created_at', label: 'Joined', render: (v) => <span className="text-slate-500 text-sm">{formatDate(v)}</span> },
  ];

  const roleCounts = {
    admin: users.filter((u) => u.role === 'admin').length,
    manager: users.filter((u) => u.role === 'manager').length,
    viewer: users.filter((u) => u.role === 'viewer').length,
  };

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
            <p className="text-sm text-slate-500 mt-0.5">User management & access control</p>
          </div>
        </div>
        <Button variant="primary" onClick={openCreate}><Plus className="w-4 h-4" /> Add User</Button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{roleCounts.admin}</p>
          <p className="text-sm text-red-700 mt-1">Admins</p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{roleCounts.manager}</p>
          <p className="text-sm text-indigo-700 mt-1">Managers</p>
        </div>
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-teal-600">{roleCounts.viewer}</p>
          <p className="text-sm text-teal-700 mt-1">Viewers</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 card-shadow-md border border-slate-100">
        <Table
          columns={columns}
          data={users}
          searchPlaceholder="Search users…"
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
        title={editItem ? 'Edit User' : 'Create User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} loading={saving}>{editItem ? 'Save Changes' : 'Create User'}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <FormField label="Full Name" required error={errors.name}>
            <Input id="user-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Admin User" error={errors.name} />
          </FormField>
          <FormField label="Email" required error={errors.email}>
            <Input id="user-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="user@example.com" error={errors.email} />
          </FormField>
          <FormField label={editItem ? 'New Password (leave blank to keep)' : 'Password'} required={!editItem} error={errors.password}>
            <Input id="user-password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" error={errors.password} />
          </FormField>
          <div className="grid grid-cols-2 gap-3">
            <FormField label="Role">
              <Select id="user-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="viewer">Viewer</option>
              </Select>
            </FormField>
            <FormField label="Status">
              <Select id="user-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Select>
            </FormField>
          </div>
          <FormField label="Image URL">
            <Input id="user-image" type="url" placeholder="https://example.com/image.jpg" value={form.image || ''} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          </FormField>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete User?"
        message="This user will permanently lose access to the system."
      />
    </div>
  );
};

export default Admin;
