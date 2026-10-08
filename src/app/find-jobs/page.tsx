"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  RotateCcw,
  Zap,
  Clock,
  Building2,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { getAllJobs } from "@/services";
import { Job } from "@/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonLoader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function FindJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [minSalary, setMinSalary] = useState<number>(0);
  const [sortBy, setSortBy] = useState<"newest" | "salary">("newest");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    getAllJobs().then((data) => {
      setJobs(data);
      setLoading(false);
    });
  }, []);

  const categories = ["All", "Electrician", "Welder", "AC Technician", "Driver", "Plumber", "Helper"];
  const locations = ["All", "Visakhapatnam", "Vijayawada", "Hyderabad"];
  const types = ["All", "Full-Time", "Part-Time", "Contract"];

  const filteredJobs = jobs
    .filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory = selectedCategory === "All" || job.category === selectedCategory;
      const matchLocation = selectedLocation === "All" || job.location.includes(selectedLocation);
      const matchType = selectedType === "All" || job.jobType === selectedType;
      const matchSalary = job.salaryMin >= minSalary;

      return matchSearch && matchCategory && matchLocation && matchType && matchSalary;
    })
    .sort((a, b) => {
      if (sortBy === "salary") return b.salaryMin - a.salaryMin;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLocation("All");
    setSelectedType("All");
    setMinSalary(0);
    setSortBy("newest");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <PublicHeader />

      {/* Header Banner */}
      <section className="bg-slate-900 text-white py-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                JobConnect Opportunities
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2">
                Find Blue-Collar Jobs
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">
                Browse verified trade vacancies across Andhra Pradesh & Telangana.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/90 border border-slate-700 p-2.5 rounded-2xl">
              <span className="text-xs text-slate-300 font-medium">Sort By:</span>
              <button
                onClick={() => setSortBy("newest")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sortBy === "newest" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Newest First
              </button>
              <button
                onClick={() => setSortBy("salary")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  sortBy === "salary" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Highest Salary
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar Filters Desktop */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs h-fit sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Filter className="w-4 h-4 text-blue-600" />
                <span>Search Filters</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-slate-500 font-semibold hover:text-rose-600 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Keyword Search</label>
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Electrician, MIG Welding"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Trade Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">City / Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">Employment Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                {types.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Salary Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-slate-800">Minimum Salary</label>
                <span className="text-xs font-extrabold text-blue-600">₹{minSalary.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={0}
                max={30000}
                step={2000}
                value={minSalary}
                onChange={(e) => setMinSalary(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </aside>

          {/* Right Job Cards List */}
          <div className="lg:col-span-9 space-y-4">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center gap-2 text-xs font-bold text-slate-800"
              >
                <Filter className="w-4 h-4 text-blue-600" />
                Filter Jobs ({filteredJobs.length} results)
              </button>
              <button onClick={handleResetFilters} className="text-[11px] text-slate-500 hover:text-rose-600 font-semibold">
                Reset
              </button>
            </div>

            {/* Mobile Filters Drawer inline */}
            {mobileFilterOpen && (
              <div className="lg:hidden bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <input
                  type="text"
                  placeholder="Keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border rounded-xl text-xs"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Results count indicator */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>
                Showing <strong className="text-slate-900">{filteredJobs.length}</strong> matching vacancies
              </span>
            </div>

            {/* Loading or Job list */}
            {loading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : filteredJobs.length === 0 ? (
              <EmptyState
                title="No Jobs Found"
                description="Try changing your search terms, category filters, or resetting salary bounds."
                actionText="Reset Filters"
                onActionClick={handleResetFilters}
              />
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:shadow-md transition-all space-y-4 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md border border-blue-200">
                            {job.category}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-500">
                            Posted {job.createdAt}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {job.employerName}
                          <span className="text-slate-300">•</span>
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </p>
                      </div>

                      {/* Salary pill */}
                      <div className="text-left sm:text-right shrink-0">
                        <div className="text-lg font-black text-slate-900">
                          ₹{job.salaryMin.toLocaleString()} – ₹{job.salaryMax.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-500 font-medium capitalize">
                          Per {job.salaryPeriod}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Required Skills Badges */}
                    <div className="flex items-center gap-2 flex-wrap pt-1">
                      {job.requiredSkills.map((skill, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Card Footer actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                        <span>Exp: <strong>{job.experienceYears}+ Yrs</strong></span>
                        <span>Type: <strong>{job.jobType}</strong></span>
                        <span>Workers: <strong>{job.numberOfWorkers} Needed</strong></span>
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1"
                        >
                          View Details & Apply <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
