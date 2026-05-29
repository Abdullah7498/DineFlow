import React from 'react';
import {
  BarChart3,
  Bell,
  Boxes,
  ChefHat,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Settings,
  Table2,
  Utensils,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { Button, Select } from '../ui';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { cn } from '../../lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['owner', 'manager'] },
  { to: '/orders', label: 'Orders', icon: ClipboardList, roles: ['owner', 'manager', 'cashier', 'chef', 'waiter'] },
  { to: '/pos', label: 'POS', icon: CreditCard, roles: ['owner', 'manager', 'cashier', 'waiter'] },
  { to: '/kitchen', label: 'Kitchen', icon: ChefHat, roles: ['owner', 'manager', 'chef'] },
  { to: '/menu', label: 'Menu', icon: Utensils, roles: ['owner', 'manager', 'chef'] },
  { to: '/inventory', label: 'Inventory', icon: Boxes, roles: ['owner', 'manager', 'chef'] },
  { to: '/tables', label: 'Tables', icon: Table2, roles: ['owner', 'manager', 'cashier', 'waiter'] },
];

const titles = {
  '/dashboard': ['Dashboard', 'Sales, live operations, and stock health'],
  '/orders': ['Orders', 'Branch order pipeline'],
  '/pos': ['POS', 'Fast counter billing'],
  '/kitchen': ['Kitchen Display', 'Preparation workflow'],
  '/menu': ['Menu', 'Categories, items, prices, and availability'],
  '/inventory': ['Inventory', 'Stock levels and reorder control'],
  '/tables': ['Tables', 'Branches, tables, and QR codes'],
};

export function AppLayout() {
  const { user, logout } = useAuth();
  const { branches, branchId, selectedBranch, changeBranch, refresh, loading, notice, setNotice } = useWorkspace();
  const location = useLocation();
  const [title, subtitle] = titles[location.pathname] || titles['/dashboard'];
  const visibleNav = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 lg:grid lg:grid-cols-[272px_1fr]">
      <aside className="border-b border-slate-200 bg-white p-4 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-700 text-white">
            <Utensils size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black">DineFlow</h1>
            <p className="truncate text-xs font-medium text-slate-500">{user?.tenantName || user?.role || 'Operations'}</p>
          </div>
        </div>

        <nav className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => cn(
                  'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950',
                  isActive && 'bg-teal-50 text-teal-700'
                )}
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <Button variant="ghost" className="mt-6 w-full justify-start" onClick={logout}>
          <LogOut size={18} />
          Sign out
        </Button>
      </aside>

      <main className="min-w-0 p-4 sm:p-6">
        <header className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-teal-700">
              <BarChart3 size={14} />
              {selectedBranch?.name || 'No branch selected'}
            </div>
            <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Select className="w-56" value={branchId} onChange={(event) => changeBranch(event.target.value)}>
              <option value="">No branch</option>
              {branches.map((branch) => <option key={branch._id} value={branch._id}>{branch.name}</option>)}
            </Select>
            <Button variant="secondary" size="icon" onClick={refresh} title="Refresh">
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button variant="secondary" size="icon" title="Notifications"><Bell size={18} /></Button>
            <Button variant="secondary" size="icon" title="Settings"><Settings size={18} /></Button>
          </div>
        </header>

        {notice ? (
          <button className="mb-4 w-full rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm font-semibold text-rose-700" onClick={() => setNotice('')}>
            {notice}
          </button>
        ) : null}

        <Outlet />
      </main>
    </div>
  );
}
