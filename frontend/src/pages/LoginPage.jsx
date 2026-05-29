import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Utensils } from 'lucide-react';

import { Button, Card, CardContent, Input } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { cn } from '../lib/utils';

export default function LoginPage() {
  const { isAuthenticated, setSession } = useAuth();
  const location = useLocation();
  const [mode, setMode] = useState('owner');
  const [form, setForm] = useState({ tenant: '', email: '', employeeKey: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/dashboard'} replace />;
  }

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = mode === 'owner'
        ? await api.ownerLogin(form.tenant, form.email, form.password)
        : await api.employeeLogin(form.employeeKey, form.password);
      setSession({ token: result.token, user: result.data, mode });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(rgba(15,23,42,.70),rgba(15,23,42,.70)),url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-700 text-white">
              <Utensils size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black">DineFlow Console</h1>
              <p className="text-sm text-slate-500">Restaurant operations workspace</p>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
            {['owner', 'staff'].map((item) => (
              <button
                key={item}
                type="button"
                className={cn('h-10 rounded-md text-sm font-bold capitalize text-slate-500', mode === item && 'bg-white text-teal-700 shadow-sm')}
                onClick={() => setMode(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <form className="grid gap-3" onSubmit={submit}>
            {mode === 'owner' ? (
              <>
                <Input placeholder="Tenant slug or prefix" value={form.tenant} onChange={(event) => setForm({ ...form, tenant: event.target.value })} required />
                <Input type="email" placeholder="owner@restaurant.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
              </>
            ) : (
              <Input placeholder="Employee key, e.g. kfc1" value={form.employeeKey} onChange={(event) => setForm({ ...form, employeeKey: event.target.value })} required />
            )}
            <Input type="password" placeholder="Password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required />
            {error ? <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700">{error}</div> : null}
            <Button disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
