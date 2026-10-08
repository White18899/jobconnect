"use client";

import React from "react";
import { Lock, Unlock, AlertCircle, CheckCircle2, X } from "lucide-react";

interface UnlockWorkerModalProps {
  isOpen: boolean;
  workerName: string;
  availableCredits: number;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export const UnlockWorkerModal: React.FC<UnlockWorkerModalProps> = ({
  isOpen,
  workerName,
  availableCredits,
  onClose,
  onConfirm,
  isProcessing = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-blue-700 font-bold text-lg">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Unlock className="w-5 h-5" />
            </div>
            <span>Unlock Worker Profile</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-5 space-y-4">
          <p className="text-slate-700 text-sm leading-relaxed">
            Are you sure you want to unlock <strong className="text-slate-950">{workerName}</strong>&apos;s protected information?
          </p>

          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 space-y-2 text-xs text-blue-900">
            <p className="font-bold flex items-center gap-1.5 text-blue-950">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              1 Unlock Credit will be used
            </p>
            <p className="text-slate-600">
              Remaining credits after unlock: <strong className="text-slate-900">{Math.max(0, availableCredits - 1)}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-900">Information unlocked for you:</p>
            <ul className="space-y-1.5 pl-1">
              <li className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Worker Contact Phone & Email
              </li>
              <li className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Personal Details & Full Address
              </li>
              <li className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Workplace & Reference Details
              </li>
              <li className="flex items-center gap-2 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5" /> Resume / CV Download Link
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 italic">
              * Reciprocal Rule: The worker will also be granted view access to your company&apos;s contact & HR details for transparent communication.
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isProcessing || availableCredits < 1}
            className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? "Unlocking..." : "Confirm Unlock"}
          </button>
        </div>
      </div>
    </div>
  );
};
