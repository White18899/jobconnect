import React from 'react';
import { Job } from '../../services/mockData';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { PlusCircle, Users, Clock, IndianRupee, MapPin, Eye, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface MyJobsPageProps {
  jobs: Job[];
  onSelectJobForApplicants: (jobId: string) => void;
  onPostNewJob: () => void;
  onToggleStatus: (jobId: string) => void;
}

export const MyJobsPage: React.FC<MyJobsPageProps> = ({
  jobs,
  onSelectJobForApplicants,
  onPostNewJob,
  onToggleStatus,
}) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-xl mx-auto pb-16 space-y-4">
      {/* Header with Post Job CTA */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            {t('employer.my_jobs_title')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage your vacancies and incoming worker applications
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          onClick={onPostNewJob}
          icon={<PlusCircle className="w-4 h-4 mr-1" />}
        >
          {t('nav.post_job')}
        </Button>
      </div>

      {/* Jobs list */}
      <div className="space-y-3.5">
        {jobs.map((job) => {
          const isOpen = job.status === 'open';

          return (
            <Card key={job.id} className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-blue-50 text-brand-900 text-[11px] font-bold tracking-wide uppercase mb-1">
                    {job.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 font-heading">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.location_area}, {job.location_city}</span>
                  </div>
                </div>

                {/* Status Toggle Badge */}
                <button
                  onClick={() => onToggleStatus(job.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition border ${
                    isOpen
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                  title="Click to toggle Open / Closed"
                >
                  {isOpen ? 'Active / Open' : 'Closed'}
                </button>
              </div>

              {/* Pay & Hours */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>{job.salary_min.toLocaleString('en-IN')} - {job.salary_max.toLocaleString('en-IN')} / mo</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{job.working_hours}</span>
                </div>
              </div>

              {/* View Applicants button */}
              <div className="pt-1 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-900" />
                  <span>{job.vacancies} open position(s)</span>
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onSelectJobForApplicants(job.id)}
                  icon={<Eye className="w-3.5 h-3.5 mr-1" />}
                >
                  View Applicants
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
