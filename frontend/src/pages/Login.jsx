import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BarChart3, Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import toast from 'react-hot-toast';

const Login = () => {
  const { login, token, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: 'admin@sportsync.com', password: 'password' });
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (token) return <Navigate to={ROUTES.DASHBOARD} replace />;

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    const result = await login(form);
    setSubmitting(false);
    if (result.success) {
      toast.success('Welcome back! 🎉');
      navigate(ROUTES.DASHBOARD);
    } else {
      toast.error(result.message || 'Login failed');
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
              <p className="text-slate-400 text-sm mt-1">Sports Management System</p>
            </div>
          </div>

          <h2 className="text-lg font-semibold text-white mb-6">Sign in to your account</h2>

          {/* Demo credentials hint */}
          <div className="mb-5 p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <p className="text-xs text-indigo-300 font-medium">Demo credentials pre-filled</p>
            <p className="text-xs text-slate-400 mt-0.5">admin@sportsync.com / password</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
            {errors.general && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-sm text-red-400">{errors.general}</p>
              </div>
            )}

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-300">Email address</label>
              <input
                id="email-input"
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
                  id="password-input"
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

            {/* Submit */}
            <button
              id="login-button"
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              {submitting ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-xs mt-6">
          © {new Date().getFullYear()} SportSync. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
