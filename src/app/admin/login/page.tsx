'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin');
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B130E] flex items-center justify-center px-4">
      {/* Background Glows */}
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#FF6B4A]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B4A] via-emerald-600 to-emerald-800 shadow-[0_0_30px_rgba(255,107,74,0.3)]">
            <Compass size={28} className="text-slate-100" />
          </div>
          <h1 className="text-2xl font-black text-slate-100">
            Explore<span className="text-[#FF6B4A]">Pakur</span> Admin
          </h1>
          <p className="text-sm text-slate-400">Enter your admin password to manage locations</p>
        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="bg-[#111E16] border border-emerald-500/20 rounded-2xl p-6 sm:p-8 space-y-5 shadow-2xl"
        >
          {error && (
            <div className="bg-red-900/30 border border-red-500/40 text-red-300 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <Lock size={14} />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Admin Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#0B130E] border border-emerald-500/20 rounded-xl pl-10 pr-12 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF6B4A] transition-all"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-[#FF6B4A] hover:bg-[#ff5530] disabled:opacity-60 disabled:cursor-not-allowed text-[#0B130E] font-bold px-6 py-3 rounded-xl text-sm shadow-[0_0_20px_rgba(255,107,74,0.3)] transition-all active:scale-98"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Panel'}</span>
          </button>

          <p className="text-center text-[11px] text-slate-500">
            Default password: <code className="text-slate-400 bg-[#0B130E] px-1.5 py-0.5 rounded">explorepakur2024</code>
          </p>
        </form>
      </div>
    </div>
  );
}
