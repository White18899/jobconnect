import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { User, ShieldCheck, Camera, FileCheck, CheckCircle2, Phone, Save } from 'lucide-react';

export const WorkerProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [fullName, setFullName] = useState('Ramesh Kumar Goud');
  const [skills, setSkills] = useState(['Two-Wheeler Mechanic', 'Welder']);
  const [newSkill, setNewSkill] = useState('');
  const [experienceYears, setExperienceYears] = useState(4.5);
  const [preferredArea, setPreferredArea] = useState('Kukatpally');
  const [city, setCity] = useState('Hyderabad');
  const [salaryMin, setSalaryMin] = useState(18000);
  const [salaryMax, setSalaryMax] = useState(24000);
  const [idType, setIdType] = useState('aadhaar_masked');
  const [maskedId, setMaskedId] = useState('XXXX-XXXX-4912');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto pb-28 space-y-4">
      <div className="pt-1">
        <h1 className="text-2xl font-black text-slate-900 font-heading">Worker Profile</h1>
        <p className="text-xs text-slate-500 font-medium">
          Manage your verified credentials and work preferences
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {/* Verification Status Card */}
      <Card className="bg-linear-to-r from-blue-900 to-indigo-900 text-white border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-bold text-2xl border border-white/20">
            {fullName.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold font-heading">{fullName}</h2>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-blue-200 mt-0.5">{user?.phone || '+91 9123456780'}</p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
              Verified Worker ID
            </span>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2">
            Personal & Work Details
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium outline-hidden focus:border-brand-900"
              required
            />
          </div>

          {/* Skills Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Your Skills (Add or Remove)
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-blue-50 text-brand-900 text-xs font-semibold border border-blue-200"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-600 ml-1 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Electrician, Carpenter..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
              <Button type="button" size="sm" variant="secondary" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                step="0.5"
                value={experienceYears}
                onChange={(e) => setExperienceYears(parseFloat(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Preferred City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Locality / Area</label>
            <input
              type="text"
              value={preferredArea}
              onChange={(e) => setPreferredArea(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Min Expected Pay (₹/mo)
              </label>
              <input
                type="number"
                value={salaryMin}
                onChange={(e) => setSalaryMin(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Max Expected Pay (₹/mo)
              </label>
              <input
                type="number"
                value={salaryMax}
                onChange={(e) => setSalaryMax(parseInt(e.target.value, 10))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900"
              />
            </div>
          </div>
        </Card>

        {/* Verification Documents & Privacy Card */}
        <Card className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-heading border-b border-slate-100 pb-2">
            Verification & Identity Proofs
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Government ID Proof Type
            </label>
            <select
              value={idType}
              onChange={(e) => setIdType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-hidden focus:border-brand-900 bg-white"
            >
              <option value="aadhaar_masked">Masked Aadhaar Card (DigiLocker)</option>
              <option value="voter_id">Voter ID Card</option>
              <option value="driving_licence">Driving Licence</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Masked ID Number (Private & Encrypted)
            </label>
            <input
              type="text"
              value={maskedId}
              readOnly
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm font-bold text-slate-700 outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              🔒 Full Aadhaar numbers are never stored in accordance with UIDAI privacy guidelines.
            </p>
          </div>

          {/* Photo & Selfie Proof Status */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Live Selfie
              </div>
              <span className="text-[11px] text-emerald-700">Matched to ID photo</span>
            </div>

            <div className="p-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ID Document
              </div>
              <span className="text-[11px] text-emerald-700">Verified by Admin</span>
            </div>
          </div>
        </Card>

        <Button type="submit" size="lg" fullWidth icon={<Save className="w-4 h-4 mr-1" />}>
          Save Profile Changes
        </Button>
      </form>
    </div>
  );
};
