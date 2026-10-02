import React from 'react';
import { GlassCard } from '../../components/common/GlassCard';
import { Button } from '../../components/common/Button';
import { useAuth, UserRole } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Lock,
  ArrowRight,
  Sparkles,
  Store,
  PhoneCall,
} from 'lucide-react';

interface LandingPageProps {
  onStartWorker: () => void;
  onStartEmployer: () => void;
  onOpenAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartWorker,
  onStartEmployer,
  onOpenAdmin,
}) => {
  const { switchRole } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Section with Glassmorphism */}
      <div className="relative pt-4 sm:pt-8">
        {/* Soft background glow accents */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-48 h-48 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

        <GlassCard variant="hero" className="text-center relative max-w-2xl mx-auto py-8 sm:py-12 px-6">
          {/* Top trust badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-brand-900 text-xs font-bold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-4 h-4 text-brand-900" />
            <span>{t('landing.badge_verified')}</span>
          </div>

          {/* Main Hero Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4 font-heading">
            {t('landing.hero_title')}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-lg mx-auto leading-relaxed mb-8">
            {t('landing.hero_subtitle')}
          </p>

          {/* Primary Two Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
            <Button
              size="lg"
              variant="primary"
              onClick={onStartWorker}
              className="text-base"
              icon={<Briefcase className="w-5 h-5 mr-1" />}
            >
              {t('landing.cta_worker')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onStartEmployer}
              className="text-base border-brand-900 text-brand-900 hover:bg-blue-50/50"
              icon={<Store className="w-5 h-5 mr-1 text-brand-900" />}
            >
              {t('landing.cta_employer')}
            </Button>
          </div>

          {/* Micro Trust Stats */}
          <div className="grid grid-cols-3 gap-2 pt-8 mt-8 border-t border-slate-200/60 text-center">
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 font-heading">1,200+</div>
              <div className="text-[11px] text-slate-500 font-medium">Jobs Active</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-slate-900 font-heading">4,500+</div>
              <div className="text-[11px] text-slate-500 font-medium">Verified Workers</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-black text-emerald-700 font-heading">100%</div>
              <div className="text-[11px] text-slate-500 font-medium">Refund Shield</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* How JobConnect Works (Minimalist Cards) */}
      <div className="max-w-2xl mx-auto pt-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-slate-900 font-heading">
            How JobConnect Works
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Privacy-first direct connection in 3 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-900 flex items-center justify-center font-bold text-sm mb-3">
              1
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 font-heading">Post & Apply</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Employers post job vacancies. Workers browse and apply directly in 1 tap.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm mb-3">
              2
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 font-heading">₹499 Verification</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Employer accepts candidate & pays ₹499 fee via UPI QR. Admin verifies ID & shop proofs.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-soft">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold text-sm mb-3">
              3
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1 font-heading">Direct Contact</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Worker phone & exact Google Map shop location unlock instantly. Call & start work!
            </p>
          </div>
        </div>
      </div>

      {/* Strict Privacy Shield Section */}
      <div className="max-w-2xl mx-auto bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6 text-brand-200" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading mb-1.5">
              Built-in Privacy & Identity Protection
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              We never display full Aadhaar numbers or leak phone numbers and shop coordinates across the network until admin verification is approved.
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Masked Government IDs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Private R2 Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Zero Middlemen Margin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Automatic Refund Policy</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Quick Switch (Convenience Bar) */}
      <div className="max-w-2xl mx-auto text-center pt-4">
        <button
          onClick={onOpenAdmin}
          className="text-xs font-semibold text-slate-400 hover:text-slate-700 underline"
        >
          Open Admin Panel (Verification Queue & Audit Logs)
        </button>
      </div>
    </div>
  );
};
