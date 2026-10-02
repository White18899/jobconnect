import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Job } from '../../services/mockData';
import { useLanguage } from '../../contexts/LanguageContext';
import { Briefcase, IndianRupee, MapPin, Clock, Lock, CheckCircle2, ArrowLeft } from 'lucide-react';

interface PostJobPageProps {
  onJobCreated: (newJob: Job) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Mechanic',
  'Cook',
  'Welder',
  'Electrician',
  'Helper',
  'Carpenter',
  'Driver',
  'Plumber',
  'Tailor',
];

export const PostJobPage: React.FC<PostJobPageProps> = ({ onJobCreated, onCancel }) => {
  const { t } = useLanguage();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Mechanic');
  const [salaryMin, setSalaryMin] = useState(16000);
  const [salaryMax, setSalaryMax] = useState(22000);
  const [salaryPeriod, setSalaryPeriod] = useState<'hourly' | 'daily' | 'monthly'>('monthly');
  const [locationArea, setLocationArea] = useState('KPHB Colony Phase 3');
  const [locationCity, setLocationCity] = useState('Hyderabad');
  const [workingHours, setWorkingHours] = useState('9:00 AM - 7:00 PM');
  const [requirementsInput, setRequirementsInput] = useState('2+ years experience, Hard working, Punctual');
  const [vacancies, setVacancies] = useState(1);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const requirements = requirementsInput
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean);

    const newJob: Job = {
      id: 'job_' + Date.now(),
      employer_id: 'ep_01',
      business_name: 'Sri Balaji Auto Care & Service',
      business_type: 'Automobile Workshop',
      employer_verified: true,
      title,
      description: description || 'Immediate requirement for dedicated staff. Good working environment.',
      category,
      salary_min: salaryMin,
      salary_max: salaryMax,
      salary_period: salaryPeriod,
      location_area: locationArea,
      location_city: locationCity,
      working_hours: workingHours,
      requirements,
      vacancies,
      status: 'open',
      created_at: new Date().toISOString(),
    };

    setTimeout(() => {
      onJobCreated(newJob);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="max-w-xl mx-auto pb-20 space-y-4">
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onCancel}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Cancel
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          {t('employer.post_job_title')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Post an open position to reach verified workers in your area
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('employer.job_title')} <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('employer.job_title_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-hidden focus:border-brand-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('employer.category')}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-hidden focus:border-brand-900 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Salary fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employer.salary_min')}
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employer.salary_max')}
              </label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employer.salary_period')}
              </label>
              <select
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900 bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employer.vacancies')}
              </label>
              <input
                type="number"
                min="1"
                value={vacancies}
                onChange={(e) => setVacancies(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('employer.working_hours')}
            </label>
            <input
              type="text"
              value={workingHours}
              onChange={(e) => setWorkingHours(e.target.value)}
              placeholder={t('employer.working_hours_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
              required
            />
          </div>

          {/* Location Area (Public) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employer.location_area')}
              </label>
              <input
                type="text"
                value={locationArea}
                onChange={(e) => setLocationArea(e.target.value)}
                placeholder={t('employer.location_area_placeholder')}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employer.location_city')}
              </label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <b>Location Privacy Notice:</b> Only your Locality/Area and City will be publicly shown on the job card. Your exact shop address and GPS pin are locked until you accept an applicant and the ₹499 fee is verified.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('employer.requirements')} (comma-separated)
            </label>
            <input
              type="text"
              value={requirementsInput}
              onChange={(e) => setRequirementsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('employer.description')}
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe daily responsibilities, tools required, and work timings..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
            />
          </div>
        </Card>

        <Button type="submit" size="lg" fullWidth loading={loading}>
          {t('employer.submit_job')}
        </Button>
      </form>
    </div>
  );
};
