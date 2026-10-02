import React, { useState } from 'react';
import { Application } from '../../services/mockData';
import { ApplicationItem } from '../../components/worker/ApplicationItem';
import { UnlockedJobView } from '../../components/worker/UnlockedJobView';
import { EmptyState } from '../../components/common/EmptyState';
import { FileText, Unlock, CheckCircle, Clock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MyApplicationsPageProps {
  applications: Application[];
  onViewJob: (app: Application) => void;
  onExploreJobs: () => void;
}

export const MyApplicationsPage: React.FC<MyApplicationsPageProps> = ({
  applications,
  onViewJob,
  onExploreJobs,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedUnlockedApp, setSelectedUnlockedApp] = useState<Application | null>(null);

  // If viewing a specific unlocked job, render the full screen UnlockedJobView
  if (selectedUnlockedApp) {
    return (
      <UnlockedJobView
        application={selectedUnlockedApp}
        onBack={() => setSelectedUnlockedApp(null)}
      />
    );
  }

  const tabs = [
    { id: 'all', label: t('applications.tab_all') },
    { id: 'unlocked', label: t('applications.tab_unlocked') },
    { id: 'pending', label: t('applications.tab_pending') },
    { id: 'accepted', label: t('applications.tab_accepted') },
    { id: 'applied', label: t('applications.tab_applied') },
  ];

  const filteredApps = applications.filter((app) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unlocked') return app.status === 'unlocked';
    if (activeTab === 'pending') return app.status === 'pending_verification';
    if (activeTab === 'accepted') return app.status === 'accepted';
    if (activeTab === 'applied') return app.status === 'applied';
    return true;
  });

  return (
    <div className="max-w-xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            {t('applications.title')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Track your job application & unlock statuses
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
          {applications.length} Total
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
                isSelected
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Application List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <ApplicationItem
              key={app.id}
              application={app}
              onViewUnlocked={(unlockedApp) => setSelectedUnlockedApp(unlockedApp)}
              onViewJob={onViewJob}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No applications in this category"
          description="Browse available job vacancies in your area and apply with one tap."
          actionText="Browse Jobs"
          onAction={onExploreJobs}
        />
      )}
    </div>
  );
};
