import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { BrandLogo } from '../../components/common/BrandLogo';
import { ShieldCheck, Lock, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../../components/common/Button';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onLoginSuccess,
  onBackToHome,
}) => {
  const { login } = useAuth();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the administrator access password');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await api.adminLogin(password.trim());
      login(res.user?.phone || '+919999999999', 'admin', res.token, res.user?.id || 'usr_admin_01');
      onLoginSuccess();
    } catch (err: any) {
      console.error('Admin login failed:', err.message);
      setError(err.message || 'Invalid administrator password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full">
        {/* Security Badge Container */}
        <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-xl border border-slate-200/80 relative overflow-hidden">
          {/* Subtle security accent gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-slate-900 via-brand-900 to-slate-800" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <BrandLogo size="md" subtitle="ADMIN CONSOLE" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 font-heading tracking-tight">
              Administrative Access
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              Restricted portal &bull; Authorized personnel only
            </p>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Admin Access Password
              </label>
              <div className="relative flex rounded-2xl border-2 border-slate-200 focus-within:border-slate-900 transition bg-slate-50/50">
                <span className="inline-flex items-center pl-4 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-3 py-3.5 bg-transparent text-sm font-medium outline-hidden"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-4 text-slate-400 hover:text-slate-600 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              className="bg-slate-900 hover:bg-black text-white font-bold py-3.5 mt-2"
              icon={<ArrowRight className="w-4 h-4 ml-1" />}
            >
              Authenticate & Enter Console
            </Button>
          </form>

          {/* Footer Back Link */}
          <div className="text-center mt-6 pt-6 border-t border-slate-100">
            <button
              onClick={onBackToHome}
              className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition"
            >
              &larr; Return to JobConnect Homepage
            </button>
          </div>
        </div>

        {/* Security Footer Note */}
        <p className="text-center text-[11px] text-slate-400 mt-4">
          All administrative sessions are cryptographically signed with 7-day JWT tokens and logged to Cloudflare D1 audit records.
        </p>
      </div>
    </div>
  );
};
