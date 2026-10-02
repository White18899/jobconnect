import React from 'react';

export const SkeletonJobCard: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft animate-pulse mb-3.5">
      <div className="flex justify-between items-start mb-3">
        <div className="w-2/3 h-5 bg-slate-200 rounded-md"></div>
        <div className="w-16 h-5 bg-slate-200 rounded-full"></div>
      </div>
      <div className="w-1/2 h-4 bg-slate-100 rounded-md mb-4"></div>
      <div className="flex gap-2 mb-4">
        <div className="w-20 h-6 bg-slate-100 rounded-full"></div>
        <div className="w-24 h-6 bg-slate-100 rounded-full"></div>
      </div>
      <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
        <div className="w-28 h-5 bg-slate-200 rounded-md"></div>
        <div className="w-20 h-8 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="w-full">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonJobCard key={i} />
      ))}
    </div>
  );
};
