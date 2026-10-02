import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Application } from '../../services/mockData';
import { GlassCard } from '../common/GlassCard';
import { Button } from '../common/Button';
import { MapPin, Phone, Navigation, CheckCircle2, Building, Clock, AlertCircle } from 'lucide-react';

interface UnlockedJobViewProps {
  application: Application;
  onBack: () => void;
}

export const UnlockedJobView: React.FC<UnlockedJobViewProps> = ({ application, onBack }) => {
  useEffect(() => {
    // Fire celebratory confetti on unlock reveal!
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if canvas-confetti is not loaded
    }
  }, []);

  const googleMapsUrl =
    application.map_url ||
    (application.latitude && application.longitude
      ? `https://www.google.com/maps/search/?api=1&query=${application.latitude},${application.longitude}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          application.exact_address || application.location_area
        )}`);

  return (
    <div className="space-y-4 max-w-xl mx-auto py-2">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
      >
        ← Back to Applications
      </button>

      {/* Glassmorphic Unlocked Hero Card */}
      <GlassCard variant="unlocked" className="space-y-4">
        <div className="flex items-center gap-2.5 text-emerald-800">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
              Verified & Unlocked
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 font-heading">
              {application.business_name}
            </h2>
          </div>
        </div>

        {/* Contact Person */}
        <div className="bg-white/80 rounded-2xl p-4 border border-emerald-200/60 shadow-xs">
          <div className="text-xs text-slate-500 font-medium">Contact Person:</div>
          <div className="text-base font-bold text-slate-900">{application.contact_person || 'Shop Owner'}</div>
          <div className="text-xs text-slate-600 mt-0.5">{application.job_title}</div>
        </div>

        {/* Exact Shop Address */}
        <div className="bg-white/80 rounded-2xl p-4 border border-emerald-200/60 shadow-xs space-y-2">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                Exact Shop / Business Address:
              </div>
              <p className="text-sm font-semibold text-slate-900 leading-snug mt-1">
                {application.exact_address || 'Plot 42, Phase 3, Near Ganesh Temple, KPHB Colony, Hyderabad 500072'}
              </p>
            </div>
          </div>

          {/* Open in Google Maps Primary Button */}
          <div className="pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button
                size="md"
                variant="success"
                fullWidth
                icon={<Navigation className="w-4 h-4 mr-1" />}
              >
                Open in Google Maps
              </Button>
            </a>
          </div>
        </div>

        {/* Direct Call Section */}
        {application.employer_phone && (
          <div className="bg-white/80 rounded-2xl p-4 border border-emerald-200/60 shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">Employer Mobile:</div>
              <div className="text-base font-extrabold text-slate-900 tracking-wide">
                {application.employer_phone}
              </div>
            </div>

            <a href={`tel:${application.employer_phone}`}>
              <Button
                size="md"
                variant="primary"
                icon={<Phone className="w-4 h-4 mr-1" />}
              >
                Call Now
              </Button>
            </a>
          </div>
        )}

        {/* Visiting Guidelines Alert */}
        <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-brand-900 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Next Steps for Interview:</div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              1. Call the shop owner to confirm your arrival time.<br />
              2. Carry a valid government ID (Aadhaar or Voter card).<br />
              3. Report directly to the address using the Google Maps directions above.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
