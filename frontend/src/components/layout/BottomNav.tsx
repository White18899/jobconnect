import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Briefcase,
  FileText,
  User,
  PlusCircle,
  Users,
  LayoutDashboard,
  CheckSquare,
  CreditCard,
  Building2,
} from 'lucide-react';

interface BottomNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, setCurrentTab }) => {
  const { role } = useAuth();
  const { t } = useLanguage();

  if (!role) return null;

  interface NavItem {
    id: string;
    label: string;
    icon: React.ReactNode;
  }

  let items: NavItem[] = [];

  if (role === 'worker') {
    items = [
      { id: 'jobs', label: t('nav.jobs'), icon: <Briefcase className="w-5 h-5" /> },
      { id: 'applications', label: t('nav.my_applications'), icon: <FileText className="w-5 h-5" /> },
      { id: 'worker_profile', label: t('nav.profile'), icon: <User className="w-5 h-5" /> },
    ];
  } else if (role === 'employer') {
    items = [
      { id: 'employer_jobs', label: t('nav.my_jobs'), icon: <Briefcase className="w-5 h-5" /> },
      { id: 'post_job', label: t('nav.post_job'), icon: <PlusCircle className="w-5 h-5" /> },
      { id: 'applicants', label: t('nav.applicants'), icon: <Users className="w-5 h-5" /> },
      { id: 'employer_profile', label: t('nav.profile'), icon: <Building2 className="w-5 h-5" /> },
    ];
  } else if (role === 'admin') {
    items = [
      { id: 'admin_dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'admin_queue', label: 'Queue', icon: <CheckSquare className="w-5 h-5" /> },
      { id: 'admin_payments', label: 'Payments', icon: <CreditCard className="w-5 h-5" /> },
      { id: 'admin_users', label: 'Users', icon: <Users className="w-5 h-5" /> },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 shadow-lg max-w-5xl mx-auto">
      <div className="flex justify-around items-center">
        {items.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-brand-900 font-bold'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition ${
                  isActive ? 'bg-blue-50 text-brand-900 scale-110' : ''
                }`}
              >
                {item.icon}
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
