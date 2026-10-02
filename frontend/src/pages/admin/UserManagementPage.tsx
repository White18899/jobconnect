import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Users, Search, ShieldCheck, ShieldAlert, Ban, CheckCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface UserRecord {
  id: string;
  name: string;
  phone: string;
  role: 'worker' | 'employer';
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
}

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'usr_wrk_01',
    name: 'Ramesh Kumar Goud',
    phone: '+91 9123456780',
    role: 'worker',
    isBlocked: false,
    isVerified: true,
    createdAt: '2026-09-15',
  },
  {
    id: 'usr_emp_01',
    name: 'Sri Balaji Auto Care (Venkat Rao)',
    phone: '+91 9876543210',
    role: 'employer',
    isBlocked: false,
    isVerified: true,
    createdAt: '2026-09-12',
  },
  {
    id: 'usr_wrk_02',
    name: 'Suresh Babu',
    phone: '+91 9848012345',
    role: 'worker',
    isBlocked: false,
    isVerified: true,
    createdAt: '2026-09-18',
  },
  {
    id: 'usr_emp_02',
    name: 'Annapurna Sweets (Satyanarayana)',
    phone: '+91 9848099999',
    role: 'employer',
    isBlocked: false,
    isVerified: true,
    createdAt: '2026-09-20',
  },
  {
    id: 'usr_bad_01',
    name: 'Fake Contractor Demo',
    phone: '+91 9000000001',
    role: 'employer',
    isBlocked: true,
    isVerified: false,
    createdAt: '2026-09-28',
  },
];

export const UserManagementPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'worker' | 'employer'>('all');

  const toggleBlock = (userId: string) => {
    setUsers(
      users.map((u) => (u.id === userId ? { ...u, isBlocked: !u.isBlocked } : u))
    );
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-2xl mx-auto pb-16 space-y-4">
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onBack}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          {t('admin.users')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Search users, monitor verification statuses, and suspend malicious or duplicate accounts
        </p>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs outline-hidden focus:border-brand-900 bg-white"
          />
        </div>

        <div className="flex gap-1.5">
          {(['all', 'worker', 'employer'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                roleFilter === r
                  ? 'bg-brand-900 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* User list */}
      <div className="space-y-2.5">
        {filteredUsers.map((u) => (
          <Card key={u.id} className="flex items-center justify-between p-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{u.name}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                  {u.role}
                </span>
                {u.isBlocked && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-rose-100 text-rose-700">
                    Suspended
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 font-mono font-medium">{u.phone}</div>
            </div>

            <Button
              size="sm"
              variant={u.isBlocked ? 'outline' : 'danger'}
              onClick={() => toggleBlock(u.id)}
            >
              {u.isBlocked ? 'Unblock User' : 'Block / Suspend'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
