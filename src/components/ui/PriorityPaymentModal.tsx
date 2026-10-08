"use client";

import React, { useState } from "react";
import { Zap, Upload, AlertCircle, CheckCircle2, X } from "lucide-react";

interface PriorityPaymentModalProps {
  isOpen: boolean;
  jobTitle: string;
  employerName: string;
  onClose: () => void;
  onSubmitPayment: (utr: string, fileName?: string) => void;
}

export const PriorityPaymentModal: React.FC<PriorityPaymentModalProps> = ({
  isOpen,
  jobTitle,
  employerName,
  onClose,
  onSubmitPayment,
}) => {
  const [utr, setUtr] = useState("");
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!utr.trim()) {
      setError("Please enter the UPI/Bank Transaction UTR number.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitPayment(utr, fileName || "payment_receipt.png");
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 text-amber-900 font-bold text-lg">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5 fill-amber-500" />
            </div>
            <span>Priority Application Payment</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4">
          {/* Job summary */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-slate-500 font-medium block">Job Target</span>
              <h4 className="text-sm font-bold text-slate-900">{jobTitle}</h4>
              <p className="text-xs text-slate-600">{employerName}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 font-medium block">Amount</span>
              <span className="text-xl font-black text-amber-600">₹299</span>
            </div>
          </div>

          {/* Payment QR / Details Placeholder */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 text-xs text-amber-950 space-y-2">
            <p className="font-bold flex items-center gap-1.5 text-amber-900">
              <CheckCircle2 className="w-4 h-4 text-amber-600" />
              UPI Payment Instructions:
            </p>
            <p className="text-slate-700">
              Pay <strong className="text-amber-800">₹299</strong> to UPI ID:{" "}
              <code className="bg-amber-100 px-2 py-0.5 rounded font-mono text-amber-950 font-bold">
                jobconnect@upi
              </code>
            </p>
            <p className="text-[11px] text-slate-500">
              After payment, copy the 12-digit UTR/Ref number and upload the screenshot below for admin verification.
            </p>
          </div>

          {/* UTR Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              UTR / Transaction Ref Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 328910293812"
              value={utr}
              onChange={(e) => {
                setUtr(e.target.value);
                setError("");
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            {error && <p className="text-xs text-rose-600 mt-1 font-semibold">{error}</p>}
          </div>

          {/* Upload Screenshot Placeholder */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Payment Screenshot (Optional Placeholder)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFileName(e.target.files?.[0]?.name || "")}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-700">
                {fileName ? fileName : "Click to select payment screenshot"}
              </p>
              <p className="text-[10px] text-slate-400">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Explicit Disclaimer */}
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              <strong>Important Disclaimer:</strong> ₹299 priority status enhances your application visibility and review order. Payment does <strong>NOT</strong> guarantee selection, interview, or employment.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {isSubmitting ? "Submitting..." : "Submit Payment UTR"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
