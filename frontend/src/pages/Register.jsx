import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { BarChart3, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import toast from 'react-hot-toast';

const Register = () => {
  const { register, token, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', password_confirmation: '' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to={ROUTES.DASHBOARD} replace />;

  const validate = () => {
    const e = {};
    if (!form.name) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Minimum 8 characters';
    if (form.password !== form.password_confirmation) e.password_confirmation = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    const result = await register(form);
    setSubmitting(false);
    if (result.success) {
      toast.success('Account created successfully! 🎉');
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.message || 'Registration failed');
      setErrors({ general: result.message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white">SportSync</h1>
              <p className="text-slate-400 text-sm mt-1">Create your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.general && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="John Doe"
                className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.name ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500/50'
                }`}
              />
              {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full px-4 py-2.5 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors ${
                  errors.email ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500/50'
                }`}
              />
              {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-10 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.password ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 pr-10 bg-white/5 border rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 transition-colors ${
                    errors.password_confirmation ? 'border-red-500/50 focus:ring-red-500/30' : 'border-white/10 focus:ring-indigo-500/50 focus:border-indigo-500/50'
                  }`}
                />
              </div>
              {errors.password_confirmation && <p className="text-xs text-red-400">{errors.password_confirmation}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4" />
              )}
              {submitting ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-indigo-400 hover:text-indigo-300 font-medium">
              Sign In
            </Link>
          </p>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © {new Date().getFullYear()} SportSync. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;
