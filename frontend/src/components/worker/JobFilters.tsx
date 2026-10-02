import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
}

const CATEGORIES = [
  'All Skills',
  'Mechanic',
  'Cook',
  'Welder',
  'Electrician',
  'Helper',
  'Carpenter',
  'Driver',
];

const CITIES = ['All Cities', 'Hyderabad', 'Secunderabad', 'Vijayawada', 'Bengaluru'];

export const JobFilters: React.FC<JobFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedCity,
  setSelectedCity,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3 mb-5">
      {/* Search Input */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('jobs.search_placeholder')}
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-brand-900 bg-white text-sm outline-hidden shadow-soft transition"
        />
      </div>

      {/* Category Pills (horizontal swipe on mobile) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {CATEGORIES.map((cat) => {
          const isSelected = (cat === 'All Skills' && !selectedCategory) || selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'All Skills' ? '' : cat)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition active:scale-95 ${
                isSelected
                  ? 'bg-brand-900 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* City Dropdown */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-500 font-medium">Filter Location:</span>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value === 'All Cities' ? '' : e.target.value)}
          className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-semibold text-slate-800 outline-hidden"
        >
          {CITIES.map((c) => (
            <option key={c} value={c === 'All Cities' ? '' : c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
