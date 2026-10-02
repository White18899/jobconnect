import React, { useState, useMemo } from 'react';
import { Job, INITIAL_JOBS } from '../../services/mockData';
import { JobCard } from '../../components/worker/JobCard';
import { JobFilters } from '../../components/worker/JobFilters';
import { EmptyState } from '../../components/common/EmptyState';
import { Briefcase, Sparkles } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface JobFeedPageProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
  onApplyJob: (job: Job) => void;
  appliedJobIds: Set<string>;
}

export const JobFeedPage: React.FC<JobFeedPageProps> = ({
  jobs,
  onSelectJob,
  onApplyJob,
  appliedJobIds,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !searchQuery ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location_area.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !selectedCategory || job.category.toLowerCase() === selectedCategory.toLowerCase();

      const matchesCity =
        !selectedCity || job.location_city.toLowerCase() === selectedCity.toLowerCase();

      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [jobs, searchQuery, selectedCategory, selectedCity]);

  return (
    <div className="max-w-xl mx-auto pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 font-heading">
            {t('nav.jobs')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Verified local openings near you
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-900 text-xs font-bold border border-blue-200">
          {filteredJobs.length} Available
        </span>
      </div>

      {/* Filter Bar */}
      <JobFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />

      {/* Job List */}
      {filteredJobs.length > 0 ? (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={onSelectJob}
              onApply={onApplyJob}
              hasApplied={appliedJobIds.has(job.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Briefcase className="w-8 h-8" />}
          title="No jobs found"
          description="Try clearing your category or search filters to view more opportunities."
          actionText="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('');
            setSelectedCity('');
          }}
        />
      )}
    </div>
  );
};
