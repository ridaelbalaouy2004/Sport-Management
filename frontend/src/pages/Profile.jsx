import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { usersAPI } from '../services/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.update(user.id, {
        name: form.name,
        email: form.email,
        image: form.image || null,
      });
      updateUser({ name: form.name, email: form.email, image: form.image || null });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Profile Settings</h2>
        
        <div className="flex items-center gap-6 mb-8">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg" />
          ) : (
            <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-bold border-4 border-white shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold text-slate-800">{user?.name}</h3>
            <p className="text-slate-500">{user?.role === 'admin' ? 'Administrator' : 'User'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <User className="w-4 h-4" /> Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Role
              </label>
              <input
                type="text"
                value={user?.role}
                disabled
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed capitalize"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4" /> Profile Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://example.com/avatar.png"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all disabled:opacity-70"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
