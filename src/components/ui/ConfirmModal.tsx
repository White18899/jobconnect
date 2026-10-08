"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  let iconBg = "bg-amber-100 text-amber-600";
  let btnBg = "bg-amber-600 hover:bg-amber-700 text-white";

  if (variant === "danger") {
    iconBg = "bg-rose-100 text-rose-600";
    btnBg = "bg-rose-600 hover:bg-rose-700 text-white";
  } else if (variant === "info") {
    iconBg = "bg-blue-100 text-blue-600";
    btnBg = "bg-blue-600 hover:bg-blue-700 text-white";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <div className="flex items-start gap-4">
          <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center shrink-0`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-3 pt-6 mt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 py-2.5 ${btnBg} rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
