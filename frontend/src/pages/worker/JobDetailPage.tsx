import React from 'react';
import { Job } from '../../services/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import {
  MapPin,
  Clock,
  IndianRupee,
  ShieldCheck,
  Lock,
  Building,
  CheckCircle2,
  Users,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface JobDetailPageProps {
  job: Job;
  onBack: () => void;
  onApply: (job: Job) => void;
  hasApplied: boolean;
}

export const JobDetailPage: React.FC<JobDetailPageProps> = ({
  job,
  onBack,
  onApply,
  hasApplied,
}) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto pb-20 space-y-4">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Job Feed
      </button>

      {/* Main Job Header Card */}
      <Card className="space-y-4">
        <div>
          <span className="inline-block px-3 py-1 rounded-md bg-blue-50 text-brand-900 text-xs font-bold tracking-wide uppercase mb-2">
            {job.category}
          </span>
          <h1 className="text-2xl font-black text-slate-900 font-heading leading-tight">
            {job.title}
          </h1>
          <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-600">
            <span className="font-bold text-slate-800">{job.business_name}</span>
            {job.employer_verified && (
              <span className="flex items-center gap-1 text-emerald-600 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 fill-emerald-100" />
                Verified Business
              </span>
            )}
          </div>
        </div>

        {/* Salary Highlight Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-medium">Offered Salary:</span>
            <div className="text-xl font-extrabold text-brand-900 flex items-center">
              <IndianRupee className="w-5 h-5" />
              <span>{job.salary_min.toLocaleString('en-IN')} - {job.salary_max.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <span className="px-3 py-1 bg-white rounded-xl text-xs font-bold text-slate-700 border border-slate-200 shadow-2xs">
            {job.salary_period === 'monthly' ? t('jobs.salary_per_month') : t('jobs.salary_per_day')}
          </span>
        </div>

        {/* Essential Job Specs */}
        <div className="grid grid-cols-2 gap-3 text-xs pt-1">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
            <Clock className="w-4 h-4 text-brand-900 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block">
                {t('jobs.working_hours')}
              </span>
              <span className="font-semibold text-slate-800">{job.working_hours}</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
            <Users className="w-4 h-4 text-brand-900 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 uppercase text-[10px] font-bold block">
                Openings
              </span>
              <span className="font-semibold text-slate-800">{job.vacancies} Positions</span>
            </div>
          </div>
        </div>

        {/* Masked Shop Location Box (Strict Privacy Notice) */}
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Public Location Area:</span>
          </div>
          <p className="font-semibold text-sm text-slate-900">
            {job.location_area}, {job.location_city}
          </p>
          <p className="text-[11px] text-amber-800 leading-relaxed pt-1 border-t border-amber-200/60">
            🔒 Exact shop address, door number, and Google Map coordinates stay hidden until the employer accepts your application and completes the verification check.
          </p>
        </div>

        {/* Description */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 font-heading">
            Job Description
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Key Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 font-heading">
              {t('jobs.requirements')}
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Sticky Bottom Apply Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl z-30 max-w-xl mx-auto">
        <Button
          size="lg"
          variant={hasApplied ? 'secondary' : 'primary'}
          fullWidth
          disabled={hasApplied}
          onClick={() => onApply(job)}
        >
          {hasApplied ? `${t('jobs.applied')} ✓` : t('jobs.apply_now')}
        </Button>
      </div>
    </div>
  );
};
