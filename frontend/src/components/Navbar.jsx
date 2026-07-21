import { useLocation, Link } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const PAGE_TITLES = {
  '/': 'Dashboard',
  '/sports': 'Sports',
  '/players': 'Players',
  '/teams': 'Teams',
  '/matches': 'Matches',
  '/results': 'Results',
  '/rankings': 'Rankings',
  '/admin': 'Admin Panel',
  '/profile': 'Profile Settings',
};

const Navbar = ({ onMenuToggle }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const title = PAGE_TITLES[location.pathname] || 'SportSync';

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-30 glass">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-500"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold text-slate-800">{title}</h1>
        <p className="text-xs text-slate-400 hidden sm:block">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* User */}
        <Link to="/profile" className="flex items-center gap-2 pl-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-8 h-8 rounded-xl object-cover shadow-sm" />
          ) : (
            <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )}
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-slate-700 leading-none">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </Link>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="ml-1 p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
