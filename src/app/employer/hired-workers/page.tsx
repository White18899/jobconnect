"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EmployerLayout } from "@/components/layout/EmployerLayout";
import { CheckSquare, Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { getEmployerApplications } from "@/services";
import { Application } from "@/types";

export default function EmployerHiredWorkersPage() {
  const [hired, setHired] = useState<Application[]>([]);

  useEffect(() => {
    getEmployerApplications("emp-1").then((apps) => {
      setHired(apps.filter((a) => a.status === "HIRED" || a.status === "SHORTLISTED"));
    });
  }, []);

  return (
    <EmployerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Hired Workers Roster</h1>
          <p className="text-xs text-slate-500">Candidates selected and hired for active workforce contracts.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          {hired.map((item) => (
            <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{item.workerName}</h4>
                  <p className="text-xs text-slate-600">Position: {item.jobTitle}</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Status: {item.status} ✓
                </span>
              </div>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 flex justify-between items-center">
                <span>Applied: {item.appliedDate}</span>
                <Link href={`/employer/worker/${item.workerId}`} className="text-blue-600 font-bold hover:underline">
                  View Candidate File →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </EmployerLayout>
  );
}
