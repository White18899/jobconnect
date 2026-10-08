"use client";

import React, { useState, useEffect } from "react";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { Building2, Shield, CheckCircle2 } from "lucide-react";
import { getEmployerProfile, updateEmployerProfile } from "@/services";
import { EmployerProfile } from "@/types";

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState<EmployerProfile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getEmployerProfile("emp-1").then((emp) => setProfile(emp));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await updateEmployerProfile("emp-1", profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!profile) return <EmployerLayout>Loading profile...</EmployerLayout>;

  return (
    <EmployerLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Employer Business Profile</h1>
          <p className="text-xs text-slate-500">Manage company information and protected HR contact credentials.</p>
        </div>

        {saved && (
          <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Business profile updated!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" /> Public Business Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Company Name</label>
                <input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Industry Sector</label>
                <input
                  type="text"
                  value={profile.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">City</label>
                <input
                  type="text"
                  value={profile.city}
                  onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">State</label>
                <input
                  type="text"
                  value={profile.state}
                  onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">Company Description</label>
                <textarea
                  rows={4}
                  value={profile.description}
                  onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" /> Protected HR Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">HR Lead Name</label>
                <input
                  type="text"
                  value={profile.protectedDetails?.hrName || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      protectedDetails: {
                        contactPersonPhone: profile.protectedDetails?.contactPersonPhone || "",
                        directEmail: profile.protectedDetails?.directEmail || "",
                        fullAddress: profile.protectedDetails?.fullAddress || "",
                        taxGstId: profile.protectedDetails?.taxGstId || "",
                        hrName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Direct HR Phone Number</label>
                <input
                  type="text"
                  value={profile.protectedDetails?.contactPersonPhone || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      protectedDetails: {
                        hrName: profile.protectedDetails?.hrName || "",
                        directEmail: profile.protectedDetails?.directEmail || "",
                        fullAddress: profile.protectedDetails?.fullAddress || "",
                        taxGstId: profile.protectedDetails?.taxGstId || "",
                        contactPersonPhone: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Recruitment Email</label>
                <input
                  type="email"
                  value={profile.protectedDetails?.directEmail || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      protectedDetails: {
                        hrName: profile.protectedDetails?.hrName || "",
                        contactPersonPhone: profile.protectedDetails?.contactPersonPhone || "",
                        fullAddress: profile.protectedDetails?.fullAddress || "",
                        taxGstId: profile.protectedDetails?.taxGstId || "",
                        directEmail: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">GST Tax Identification</label>
                <input
                  type="text"
                  value={profile.protectedDetails?.taxGstId || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      protectedDetails: {
                        hrName: profile.protectedDetails?.hrName || "",
                        contactPersonPhone: profile.protectedDetails?.contactPersonPhone || "",
                        directEmail: profile.protectedDetails?.directEmail || "",
                        fullAddress: profile.protectedDetails?.fullAddress || "",
                        taxGstId: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
          >
            Save Employer Profile
          </button>
        </form>
      </div>
    </EmployerLayout>
  );
}
