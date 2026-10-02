import React from 'react';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { Briefcase, ShieldCheck, User, Store, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: (role?: UserRole) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, currentTab, setCurrentTab }) => {
  const { user, role, logout } = useAuth();
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
          {/* Multilingual Selector */}
          <LanguageSwitcher />

          {/* Authenticated User Status or Login Button */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Real User Role Badge */}
              {role === 'worker' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-brand-900 text-xs font-semibold">
                  <User className="w-3.5 h-3.5" />
                  <span>Worker</span>
                  <span className="text-[11px] text-slate-500 font-normal hidden md:inline">{user.phone}</span>
                </div>
              )}
              {role === 'employer' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
                  <Store className="w-3.5 h-3.5" />
                  <span>Employer</span>
                  <span className="text-[11px] text-slate-500 font-normal hidden md:inline">{user.phone}</span>
                </div>
              )}
              {role === 'admin' && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  if (window.location.pathname.startsWith('/admin') || window.location.hash.startsWith('#admin')) {
                    window.history.pushState(null, '', '/');
                  }
                  setCurrentTab('landing');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition"
                title={t('nav.logout')}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.logout')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenLogin()}
              className="px-4 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 transition shadow-xs"
            >
              {t('nav.login')}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
