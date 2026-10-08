import React from "react";
import { ApplicationStatus, PriorityStatus, PaymentStatus } from "@/types";
import { Zap, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

interface StatusBadgeProps {
  status: ApplicationStatus | PriorityStatus | PaymentStatus | string;
  type?: "application" | "priority" | "payment";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, type = "application" }) => {
  let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
  let icon = null;
  let label = status;

  switch (status) {
    case "APPLIED":
      badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
      icon = <Clock className="w-3.5 h-3.5 mr-1" />;
      label = "Applied";
      break;
    case "UNDER_REVIEW":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
      icon = <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      label = "Under Review";
      break;
    case "SHORTLISTED":
      badgeStyle = "bg-purple-50 text-purple-700 border-purple-200";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      label = "Shortlisted";
      break;
    case "HIRED":
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />;
      label = "Hired ✓";
      break;
    case "REJECTED":
      badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
      icon = <XCircle className="w-3.5 h-3.5 mr-1" />;
      label = "Rejected";
      break;
    case "PRIORITY_ACTIVE":
      badgeStyle = "bg-amber-100 text-amber-900 border-amber-300 font-semibold shadow-xs";
      icon = <Zap className="w-3.5 h-3.5 mr-1 text-amber-600 fill-amber-500" />;
      label = "Priority ⚡";
      break;
    case "PRIORITY_PENDING":
      badgeStyle = "bg-yellow-50 text-yellow-800 border-yellow-300";
      icon = <Clock className="w-3.5 h-3.5 mr-1" />;
      label = "Priority Pending";
      break;
    case "STANDARD":
      badgeStyle = "bg-slate-100 text-slate-600 border-slate-200";
      label = "Standard";
      break;
    case "VERIFIED":
      badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold";
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      label = "Verified ✓";
      break;
    case "PENDING":
      badgeStyle = "bg-amber-50 text-amber-800 border-amber-200";
      icon = <Clock className="w-3.5 h-3.5 mr-1" />;
      label = "Pending Verification";
      break;
    default:
      label = status;
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs border ${badgeStyle} font-medium transition-all`}
    >
      {icon}
      {label}
    </span>
  );
};
