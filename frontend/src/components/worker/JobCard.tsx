import React from 'react';
import { Job } from '../../services/mockData';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MapPin, Clock, ShieldCheck, IndianRupee, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void;
  onApply?: (job: Job) => void;
  hasApplied?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSelect, onApply, hasApplied }) => {
  const { t } = useLanguage();

  return (
    <Card hoverEffect onClick={() => onSelect(job)} className="relative group mb-3.5">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-brand-900 text-[11px] font-bold tracking-wide uppercase mb-1.5">
            {job.category}
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-900 transition font-heading">
            {job.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
            <span className="font-semibold text-slate-800">{job.business_name}</span>
            {job.employer_verified && (
              <span className="flex items-center text-emerald-600 text-[11px] font-medium" title="Verified Business">
                <ShieldCheck className="w-3.5 h-3.5 fill-emerald-100" />
              </span>
            )}
          </div>
        </div>

        {/* Salary Pill */}
        <div className="text-right shrink-0">
          <div className="text-sm font-extrabold text-brand-900 flex items-center justify-end">
            <IndianRupee className="w-3.5 h-3.5" />
            <span>{job.salary_min.toLocaleString('en-IN')} - {job.salary_max.toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium">
            {job.salary_period === 'monthly' ? t('jobs.salary_per_month') : t('jobs.salary_per_day')}
          </span>
        </div>
      </div>

      {/* Meta tags */}
      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
        <div className="flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.location_area}, {job.location_city}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{job.working_hours}</span>
        </div>
      </div>

      {/* Card action */}
      <div className="mt-3.5 flex items-center justify-between pt-2">
        <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium border border-amber-200/60">
          Exact location unlocks after hire
        </span>

        {hasApplied ? (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
            {t('jobs.applied')} ✓
          </span>
        ) : (
          <div className="flex items-center gap-1 text-xs font-bold text-brand-900 group-hover:translate-x-0.5 transition">
            <span>{t('jobs.apply_now')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </Card>
  );
};
