import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Dumbbell, Users, Shield, Calendar,
  Trophy, BarChart3, Settings, ChevronLeft, ChevronRight,
  Activity,
} from 'lucide-react';
import { ROUTES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.DASHBOARD },
  { label: 'Sports', icon: Dumbbell, path: ROUTES.SPORTS },
  { label: 'Players', icon: Users, path: ROUTES.PLAYERS },
  { label: 'Teams', icon: Shield, path: ROUTES.TEAMS },
  { label: 'Matches', icon: Calendar, path: ROUTES.MATCHES },
  { label: 'Results', icon: Activity, path: ROUTES.RESULTS },
  { label: 'Rankings', icon: Trophy, path: ROUTES.RANKINGS },
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full z-40 flex flex-col
        bg-slate-900 text-white transition-all duration-300 ease-in-out
        ${collapsed ? 'w-18' : 'w-64'}
      `}
      style={{ width: collapsed ? '72px' : '260px' }}
    >
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-white leading-none">SportSync</p>
            <p className="text-xs text-slate-400 mt-0.5">Management System</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto scrollbar-thin px-2 space-y-0.5">
        {!collapsed && (
          <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Main Menu
          </p>
        )}
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === ROUTES.DASHBOARD}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }
              ${collapsed ? 'justify-center' : ''}
            `}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Admin section */}
        {isAdmin() && (
          <>
            {!collapsed && (
              <p className="px-3 mt-4 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                Administration
              </p>
            )}
            {collapsed && <div className="my-3 border-t border-slate-700/50" />}
            <NavLink
              to={ROUTES.ADMIN}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }
                ${collapsed ? 'justify-center' : ''}
              `}
              title={collapsed ? 'Admin' : undefined}
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>Admin Panel</span>}
            </NavLink>
          </>
        )}
      </nav>

      {/* User Info */}
      <div className={`border-t border-slate-700/50 px-3 py-4 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          user?.image ? (
            <img src={user.image} alt={user.name} className="w-9 h-9 rounded-xl object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0]?.toUpperCase() ?? 'U'}
            </div>
          )
        ) : (
          <div className="flex items-center gap-3">
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                {user?.name?.[0]?.toUpperCase() ?? 'U'}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{user?.name ?? 'User'}</p>
              <p className="text-xs text-slate-400 capitalize truncate">{user?.role ?? 'viewer'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-indigo-500 transition-colors shadow-md"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>
    </aside>
  );
};

export default Sidebar;
