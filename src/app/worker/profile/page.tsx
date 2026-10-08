"use client";

import React, { useState, useEffect } from "react";
import { WorkerLayout } from "@/components/layout/WorkerLayout";
import {
  User,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  Upload,
  Plus,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Eye,
  FileText,
} from "lucide-react";
import { getWorkerProfile, updateWorkerProfile } from "@/services";
import { WorkerProfile } from "@/types";

export default function WorkerProfilePage() {
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewUnlockedState, setPreviewUnlockedState] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    getWorkerProfile("user-wrk-1").then((p) => {
      setProfile(p);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await updateWorkerProfile("user-wrk-1", profile);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading || !profile) {
    return (
      <WorkerLayout>
        <div className="p-8 text-center text-xs text-slate-500">Loading Profile...</div>
      </WorkerLayout>
    );
  }

  return (
    <WorkerLayout>
      <div className="space-y-8">
        {/* Header & Preview Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Worker Credentials
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              Professional Worker Profile
            </h1>
            <p className="text-xs text-slate-500">Manage your trade experience, certifications, and protected information.</p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-600 font-semibold px-2">Preview Mode:</span>
            <button
              onClick={() => setPreviewUnlockedState(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                !previewUnlockedState
                  ? "bg-white text-slate-900 shadow-xs border border-slate-200"
                  : "text-slate-500"
              }`}
            >
              🔒 Locked (Public)
            </button>
            <button
              onClick={() => setPreviewUnlockedState(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                previewUnlockedState
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-slate-500"
              }`}
            >
              🔓 Unlocked (Employer)
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Profile saved successfully!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* SECTION 1: Professional Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-blue-600" />
              Professional Trade Information (Publicly Visible to Employers)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Primary Trade Category *</label>
                <select
                  value={profile.category}
                  onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Electrician">Electrician</option>
                  <option value="Welder">Welder</option>
                  <option value="AC Technician">AC Technician</option>
                  <option value="Driver">Driver</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Helper">Helper</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Trade Experience (Years) *</label>
                <input
                  type="number"
                  value={profile.experienceYears}
                  onChange={(e) => setProfile({ ...profile, experienceYears: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Expected Salary / Month *</label>
                <input
                  type="text"
                  value={profile.expectedSalary}
                  onChange={(e) => setProfile({ ...profile, expectedSalary: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">City *</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">State *</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Skills & Qualifications */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-blue-600" />
              Skills, Education & Languages
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Trade Skills (Comma separated)</label>
                <input
                  type="text"
                  value={profile.skills.join(", ")}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Languages Spoken</label>
                  <input
                    type="text"
                    value={profile.languages.join(", ")}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        languages: e.target.value.split(",").map((l) => l.trim()),
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: WORKER PROTECTED INFORMATION (Prompt Sections 14) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-4">
              <div className="flex items-center gap-2.5 text-amber-900 font-bold text-lg">
                <Shield className="w-6 h-6 text-amber-600" />
                <span>Protected Worker Information</span>
              </div>
              <span className="text-[11px] bg-amber-100 text-amber-950 font-bold px-3 py-1 rounded-full">
                🔒 Hidden from Unlocked Employers
              </span>
            </div>

            {!previewUnlockedState ? (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  Your personal/contact/workplace information is currently protected.
                </p>
                <p className="text-slate-600">
                  This sensitive information becomes visible to employers only after they complete the official Worker Unlock Credit process.
                </p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-xs text-emerald-950 space-y-2">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <Unlock className="w-4 h-4 text-emerald-600" />
                  🔓 Details Unlocked State (Employer View After Credit Redemption)
                </p>
                <p className="text-slate-600">
                  Contact Information ✓ • Personal Details ✓ • Workplace Details ✓ • Resume ✓
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Contact Phone Number 🔒
                </label>
                <input
                  type="text"
                  value={
                    previewUnlockedState
                      ? profile.protectedDetails?.phone || ""
                      : "+91 98765 ***** (Locked)"
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      protectedDetails: {
                        phone: e.target.value,
                        fullAddress: profile.protectedDetails?.fullAddress || "",
                        emergencyContact: profile.protectedDetails?.emergencyContact || "",
                        aadhaarLast4: profile.protectedDetails?.aadhaarLast4 || "",
                        previousEmployerName: profile.protectedDetails?.previousEmployerName || "",
                        resumeDownloadUrl: profile.protectedDetails?.resumeDownloadUrl || "",
                      },
                    })
                  }
                  disabled={!previewUnlockedState}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Full Residential Address 🔒
                </label>
                <input
                  type="text"
                  value={
                    previewUnlockedState
                      ? profile.protectedDetails?.fullAddress || ""
                      : "Flat ***, Sai Residency, Visakhapatnam (Locked)"
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      protectedDetails: {
                        phone: profile.protectedDetails?.phone || "",
                        fullAddress: e.target.value,
                        emergencyContact: profile.protectedDetails?.emergencyContact || "",
                        aadhaarLast4: profile.protectedDetails?.aadhaarLast4 || "",
                        previousEmployerName: profile.protectedDetails?.previousEmployerName || "",
                        resumeDownloadUrl: profile.protectedDetails?.resumeDownloadUrl || "",
                      },
                    })
                  }
                  disabled={!previewUnlockedState}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Emergency Contact Phone 🔒
                </label>
                <input
                  type="text"
                  value={
                    previewUnlockedState
                      ? profile.protectedDetails?.emergencyContact || ""
                      : "+91 98765 ***** (Locked)"
                  }
                  disabled={!previewUnlockedState}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Resume Download 🔒
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-slate-50 text-slate-600 truncate">
                    {profile.resumeName || "Ramesh_Kumar_CV.pdf"}
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload CV
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </WorkerLayout>
  );
}
