import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Store, ShieldCheck, MapPin, FileText, Camera, CheckCircle2, Lock, Save } from 'lucide-react';

export const EmployerProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [businessName, setBusinessName] = useState('Sri Balaji Auto Care & Service');
  const [businessType, setBusinessType] = useState('Automobile Workshop');
  const [contactPerson, setContactPerson] = useState('Venkat Rao');
  const [area, setArea] = useState('KPHB Colony Phase 3');
  const [city, setCity] = useState('Hyderabad');
  const [exactAddress, setExactAddress] = useState('Plot 42, Phase 3, Near Ganesh Temple, KPHB Colony, Hyderabad 500072');
  const [latitude, setLatitude] = useState(17.4938);
  const [longitude, setLongitude] = useState(78.3995);
  const [proofType, setProofType] = useState('udyam');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto pb-20 space-y-4">
      <div className="pt-1">
        <h1 className="text-2xl font-black text-slate-900 font-heading">
          Business Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your verified shop details and private address settings
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Business profile updated successfully!</span>
        </div>
      )}

      {/* Verified Banner */}
      <Card className="bg-linear-to-r from-slate-900 to-brand-950 text-white border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-2xl border border-white/20">
            <Store className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold font-heading">{businessName}</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{businessType} • {area}, {city}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              Verified Business Entity
            </span>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Business details */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2">
            Company / Shop Information
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Shop / Company Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold outline-hidden focus:border-brand-900"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Business Type
              </label>
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Person Name
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
          </div>

          {/* Public location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Public Locality / Area
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
                required
              />
            </div>
          </div>
        </Card>

        {/* Private Exact Address & GPS Section */}
        <Card className="space-y-4 border-amber-200 bg-amber-50/20">
          <div className="flex items-center gap-1.5 text-amber-900 font-heading font-bold text-sm border-b border-amber-200 pb-2">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Private Physical Location (Protected by Privacy Shield)</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Exact Door No., Building, Street & Landmark
            </label>
            <textarea
              rows={2}
              value={exactAddress}
              onChange={(e) => setExactAddress(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold outline-hidden focus:border-brand-900 bg-white"
              required
            />
            <p className="text-[11px] text-amber-800 mt-1">
              🔒 Workers will only be able to view this address and the Google Maps navigation button after you accept their application and admin verification is approved.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono bg-white"
              />
            </div>
          </div>
        </Card>

        {/* Verification Proofs */}
        <Card className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2">
            Business Proofs & Storefront
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Udyam Certificate
              </div>
              <span className="text-[11px] text-emerald-700">Verified & On File</span>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-0.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Storefront Photo
              </div>
              <span className="text-[11px] text-emerald-700">Signboard Matched</span>
            </div>
          </div>
        </Card>

        <Button type="submit" size="lg" fullWidth icon={<Save className="w-4 h-4 mr-1" />}>
          Save Business Profile
        </Button>
      </form>
    </div>
  );
};
