import React from 'react';

export type StatusType =
  | 'applied'
  | 'accepted'
  | 'pending'
  | 'pending_verification'
  | 'awaiting_payment'
  | 'submitted'
  | 'unlocked'
  | 'successful'
  | 'verified'
  | 'rejected'
  | 'verification_rejected'
  | 'refunded';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = status;
  let dotColor = 'bg-slate-400';

  if (['pending', 'pending_verification', 'awaiting_payment', 'submitted'].includes(normalized)) {
    styles = 'bg-amber-50 text-amber-900 border-amber-200/80';
    dotColor = 'bg-amber-500 animate-pulse';
    label = normalized === 'awaiting_payment' ? 'Awaiting Payment' : 'Pending Verification';
  } else if (['unlocked', 'successful', 'verified'].includes(normalized)) {
    styles = 'bg-emerald-50 text-emerald-900 border-emerald-300';
    dotColor = 'bg-emerald-500';
    label = normalized === 'unlocked' ? 'Unlocked & Verified' : 'Verified';
  } else if (['accepted'].includes(normalized)) {
    styles = 'bg-blue-50 text-blue-900 border-blue-200';
    dotColor = 'bg-blue-600';
    label = 'Accepted';
  } else if (['rejected', 'verification_rejected'].includes(normalized)) {
    styles = 'bg-rose-50 text-rose-900 border-rose-200';
    dotColor = 'bg-rose-500';
    label = 'Rejected';
  } else if (['refunded'].includes(normalized)) {
    styles = 'bg-purple-50 text-purple-900 border-purple-200';
    dotColor = 'bg-purple-500';
    label = 'Refunded';
  } else if (['applied'].includes(normalized)) {
    styles = 'bg-slate-100 text-slate-800 border-slate-300';
    dotColor = 'bg-slate-500';
    label = 'Applied';
  }

  const sizeClasses = size === 'sm' ? 'text-xs px-2.5 py-0.5' : 'text-xs font-semibold px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border shadow-2xs ${sizeClasses} ${styles}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="capitalize">{label}</span>
    </span>
  );
};
