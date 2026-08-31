import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';

const ADMIN_PASSWORD = '1980';
const AUTH_KEY = 'su_admin_auth';

export const isAdminAuthenticated = (): boolean => {
  try {
    return sessionStorage.getItem(AUTH_KEY) === 'true';
  } catch {
    return false;
  }
};

export const AdminLogin: React.FC = () => {
  const { toggleAdminMode } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true');
      setError('');
      // Force re-render of AdminLayout by toggling a state
      window.dispatchEvent(new Event('admin-auth-change'));
    } else {
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo variant="light" size="md" />
        </div>

        {/* Login Card */}
        <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#ea580c]/10 border border-[#ea580c]/30 flex items-center justify-center mb-4">
              <ShieldCheck className="w-7 h-7 text-[#ea580c]" />
            </div>
            <h1 className="text-lg font-bold text-white">Admin Panel</h1>
            <p className="text-xs text-[#71717a] mt-1">Enter your password to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b] pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="Password"
                autoFocus
                className="w-full bg-[#09090b] border border-[#27272a] text-white text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-[#ea580c] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-400 text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold text-sm rounded-xl py-3 flex items-center justify-center gap-2 transition-colors"
            >
              Enter Admin
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <button
          onClick={() => toggleAdminMode(false)}
          className="w-full text-center text-xs text-[#52525b] hover:text-[#a1a1aa] mt-6 transition-colors"
        >
          ← Back to Store
        </button>
      </div>
    </div>
  );
};
