import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Briefcase, ShieldCheck, User, Store, LogOut, ArrowRightLeft } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: (role?: UserRole) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, currentTab, setCurrentTab }) => {
  const { user, role, logout, switchRole } = useAuth();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 shadow-2xs">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-brand-900 flex items-center justify-center text-white shadow-md shadow-brand-900/20">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading block leading-none">
              Job<span className="text-brand-600">Connect</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Verified Hiring
            </span>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Badge & Switcher for instant preview */}
          {user && (
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
              <button
                onClick={() => switchRole('worker')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                  role === 'worker' ? 'bg-white text-brand-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Worker</span>
              </button>
              <button
                onClick={() => switchRole('employer')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                  role === 'employer' ? 'bg-white text-brand-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Employer</span>
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                  role === 'admin' ? 'bg-brand-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          )}

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* User Status / Login Button */}
          {user ? (
            <div className="flex items-center gap-1.5">
              {/* Mobile Role Switcher icon */}
              <button
                onClick={() => {
                  const nextRole: UserRole = role === 'worker' ? 'employer' : role === 'employer' ? 'admin' : 'worker';
                  switchRole(nextRole);
                }}
                className="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
                title={`Switch Role (Current: ${role})`}
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <button
                onClick={logout}
                className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition"
                title={t('nav.logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenLogin()}
              className="px-4 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 transition"
            >
              {t('nav.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
