import React from "react";

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
        <div className="h-5 bg-slate-200 rounded-full w-20"></div>
      </div>
      <div className="h-4 bg-slate-100 rounded-md w-3/4 mb-3"></div>
      <div className="h-4 bg-slate-100 rounded-md w-2/3 mb-6"></div>
      <div className="flex gap-2 mb-4">
        <div className="h-6 bg-slate-100 rounded-md w-16"></div>
        <div className="h-6 bg-slate-100 rounded-md w-20"></div>
        <div className="h-6 bg-slate-100 rounded-md w-24"></div>
      </div>
      <div className="h-10 bg-slate-200 rounded-lg w-full mt-2"></div>
    </div>
  );
};

export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs animate-pulse">
      <div className="h-8 bg-slate-200 rounded-md w-full mb-4"></div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center py-3 border-b border-slate-100">
          <div className="h-5 bg-slate-200 rounded-md w-1/4"></div>
          <div className="h-5 bg-slate-100 rounded-md w-1/4"></div>
          <div className="h-5 bg-slate-100 rounded-md w-1/6"></div>
          <div className="h-6 bg-slate-200 rounded-full w-20 ml-auto"></div>
        </div>
      ))}
    </div>
  );
};
