"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { PlusCircle, Save, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { createJob } from "@/services";

export default function EmployerPostJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    title: "",
    category: "Electrician",
    description: "",
    requiredSkills: "Electrical Wiring, Motor Maintenance, Safety",
    experienceYears: 3,
    education: "ITI in Electrical / Diploma",
    salaryMin: 20000,
    salaryMax: 26000,
    salaryPeriod: "monthly" as "monthly" | "daily" | "hourly",
    jobType: "Full-Time" as "Full-Time" | "Part-Time" | "Contract" | "Temporary",
    location: "Gajuwaka Industrial Zone, Visakhapatnam",
    workingHours: "8 Hours Shift",
    numberOfWorkers: 2,
    duration: "Permanent",
    deadline: "2026-11-15",
  });

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.title.trim()) errs.title = "Job Title is required.";
    if (!formData.description.trim()) errs.description = "Job Description is required.";
    if (formData.salaryMin <= 0) errs.salaryMin = "Minimum salary must be greater than 0.";
    if (formData.salaryMax < formData.salaryMin) errs.salaryMax = "Maximum salary cannot be less than minimum salary.";
    if (!formData.location.trim()) errs.location = "Job Location is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (status: "active" | "draft") => {
    if (status === "active" && !validate()) return;

    setLoading(true);
    await createJob({
      employerId: "emp-1",
      employerName: "Apex Electrical Infra Ltd",
      employerLocation: "Visakhapatnam, Andhra Pradesh",
      title: formData.title,
      category: formData.category,
      description: formData.description,
      requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
      experienceYears: Number(formData.experienceYears),
      education: formData.education,
      salaryMin: Number(formData.salaryMin),
      salaryMax: Number(formData.salaryMax),
      salaryPeriod: formData.salaryPeriod,
      jobType: formData.jobType,
      location: formData.location,
      workingHours: formData.workingHours,
      numberOfWorkers: Number(formData.numberOfWorkers),
      duration: formData.duration,
      deadline: formData.deadline,
    });

    setLoading(false);
    router.push("/employer/my-jobs");
  };

  return (
    <EmployerLayout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Post a New Worker Job</h1>
            <p className="text-xs text-slate-500">Fill in the job parameters to recruit qualified tradespeople.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Basic Job Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Job Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Industrial Electrician Maintenance Lead"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setErrors({ ...errors, title: "" });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.title ? "border-rose-400 bg-rose-50/50" : "border-slate-300"
                  }`}
                />
                {errors.title && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Trade Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                <label className="block text-xs font-bold text-slate-800 mb-1">Employment Type *</label>
                <select
                  value={formData.jobType}
                  onChange={(e) => setFormData({ ...formData, jobType: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Salary & Requirements */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. Compensation & Requirements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Min Salary (₹) *</label>
                <input
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData({ ...formData, salaryMin: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Max Salary (₹) *</label>
                <input
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData({ ...formData, salaryMax: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Salary Frequency</label>
                <select
                  value={formData.salaryPeriod}
                  onChange={(e) => setFormData({ ...formData, salaryPeriod: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="monthly">Per Month</option>
                  <option value="daily">Per Day</option>
                  <option value="hourly">Per Hour</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Trade Experience (Years)</label>
                <input
                  type="number"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Education Required</label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">Workers Needed</label>
                <input
                  type="number"
                  value={formData.numberOfWorkers}
                  onChange={(e) => setFormData({ ...formData, numberOfWorkers: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Description & Location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              3. Job Description & Workplace Location
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Workplace Address / City *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Required Trade Skills (Comma separated)</label>
              <input
                type="text"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Job Description *</label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail the worker responsibilities, machinery involved, working conditions, etc."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs"
              />
              {errors.description && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.description}</p>}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => router.push("/employer/my-jobs")}
              className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("draft")}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-xl hover:bg-slate-200"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit("active")}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {loading ? "Publishing..." : "Publish Job Post"}
            </button>
          </div>
        </div>
      </div>
    </EmployerLayout>
  );
}
