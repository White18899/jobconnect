import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Application } from '../../services/mockData';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { Phone, CheckCircle2, ShieldCheck, User, Star, Calendar, ArrowLeft } from 'lucide-react';

interface UnlockedWorkerViewProps {
  application: Application;
  onBack: () => void;
}

export const UnlockedWorkerView: React.FC<UnlockedWorkerViewProps> = ({ application, onBack }) => {
  const worker = application.worker;

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  }, []);

  if (!worker) return null;

  const phone = worker.phone || '+91 9123456780';

  return (
    <div className="space-y-4 max-w-xl mx-auto py-2">
      <button
        onClick={onBack}
        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Applicants
      </button>

      {/* Glassmorphic Unlocked Card */}
      <GlassCard variant="unlocked" className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              Verified Candidate Unlocked
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              {worker.full_name}
            </h2>
          </div>
        </div>

        {/* Revealed Phone & Call Now Primary CTA */}
        <div className="bg-white/90 rounded-2xl p-5 border border-emerald-200 shadow-sm space-y-3">
          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Direct Mobile Contact
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-wide font-mono">
            {phone}
          </div>

          <a href={`tel:${phone}`} className="block w-full">
            <Button
              size="lg"
              variant="success"
              fullWidth
              icon={<Phone className="w-5 h-5 mr-1" />}
            >
              Call Worker Now
            </Button>
          </a>
        </div>

        {/* Worker Qualifications */}
        <div className="bg-white/80 rounded-2xl p-4 border border-emerald-200/60 shadow-xs space-y-2 text-xs">
          <div className="font-bold text-slate-800 text-sm mb-1">Candidate Profile:</div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Skills:</span>
            <span className="font-semibold text-slate-900">{worker.skills.join(', ')}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Total Experience:</span>
            <span className="font-semibold text-slate-900">{worker.experience_years} Years</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500">Verified ID:</span>
            <span className="font-semibold text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              {worker.id_number_masked}
            </span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-500">Preferred Location:</span>
            <span className="font-semibold text-slate-900">{worker.preferred_area}, {worker.city}</span>
          </div>
        </div>

        {/* Transaction reference */}
        <div className="p-3 bg-white/60 rounded-xl text-[11px] text-slate-500 flex justify-between">
          <span>Fee Status: ₹499 Paid & Verified</span>
          <span>UTR: {application.upi_ref || '428190581920'}</span>
        </div>
      </GlassCard>
    </div>
  );
};
