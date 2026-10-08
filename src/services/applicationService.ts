import { Application, ApplicationStatus } from "@/types";
import { INITIAL_APPLICATIONS } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";
import { getAllJobs } from "./jobService";
import { getAllWorkerProfiles } from "./workerService";

/**
 * ============================================================================
 * FIRESTORE APPLICATIONS COLLECTIONS:
 * 1. Unique Job Applications: `applications/{workerId_jobId}`
 * 2. Entitlement Index: `workerEmployerApplications/{workerId_employerId}`
 * ============================================================================
 * Security Rules Enforced:
 * - Creation: workerId must match auth.uid
 * - Worker updates: restricted to `notes` field only
 * - Employer updates: restricted to `status` field only
 * - System/ownership fields (id, workerId, employerId, jobId, appliedDate) are immutable
 */

export async function getAllApplications(): Promise<Application[]> {
  // [FIREBASE CONNECT POINT]: getDocs(collection(db, "applications"))
  return getStoredData<Application[]>("applications", INITIAL_APPLICATIONS);
}

export async function getWorkerApplications(workerId: string): Promise<Application[]> {
  // [FIREBASE CONNECT POINT]: getDocs(query(collection(db, "applications"), where("workerId", "==", workerId)))
  const apps = await getAllApplications();
  return apps.filter((a) => a.workerId === workerId || a.workerId === "wrk-1");
}

export async function getEmployerApplications(employerId: string): Promise<Application[]> {
  // [FIREBASE CONNECT POINT]: getDocs(query(collection(db, "applications"), where("employerId", "==", employerId)))
  const apps = await getAllApplications();
  return apps.filter((a) => a.employerId === employerId || a.employerId === "emp-1");
}

export async function submitApplication(
  jobId: string,
  workerId: string,
  isPriority: boolean = false
): Promise<Application> {
  // [FIREBASE CONNECT POINT]: 
  // Batch write:
  // 1. setDoc(doc(db, "applications", `${workerId}_${jobId}`), appData)
  // 2. setDoc(doc(db, "workerEmployerApplications", `${workerId}_${employerId}`), { workerId, employerId, hasApplied: true, createdAt: serverTimestamp() })
  const apps = await getAllApplications();
  const jobs = await getAllJobs();
  const targetJob = jobs.find((j) => j.id === jobId);
  const profiles = await getAllWorkerProfiles();
  const worker = profiles.find((w) => w.id === workerId || w.userId === workerId) || profiles[0];

  const employerId = targetJob?.employerId || "emp-1";
  const appId = `${workerId}_${jobId}`;
  
  const newApp: Application = {
    id: appId,
    jobId,
    jobTitle: targetJob?.title || "Blue Collar Work",
    employerId,
    employerName: targetJob?.employerName || "Hiring Company",
    workerId: worker?.id || "wrk-1",
    workerName: worker?.fullName || "Applicant",
    workerCategory: worker?.category || "General Work",
    workerExperience: worker?.experienceYears || 2,
    workerCity: worker?.city || "Visakhapatnam",
    appliedDate: new Date().toISOString().split("T")[0],
    status: "APPLIED",
    priorityStatus: isPriority ? "PRIORITY_PENDING" : "STANDARD",
  };

  const updated = [newApp, ...apps];
  setStoredData("applications", updated);

  // Store Option A workerEmployerApplications entitlement mapping
  const relDocId = `${workerId}_${employerId}`;
  const rels = getStoredData<Array<{ id: string; workerId: string; employerId: string; hasApplied: boolean }>>("worker_employer_applications", []);
  if (!rels.some((r) => r.id === relDocId)) {
    setStoredData("worker_employer_applications", [{ id: relDocId, workerId, employerId, hasApplied: true }, ...rels]);
  }

  return newApp;
}

export async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<Application | null> {
  // [FIREBASE CONNECT POINT]: 
  // Employer update: updateDoc(doc(db, "applications", id), { status })
  const apps = await getAllApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;
  apps[index].status = status;
  setStoredData("applications", apps);
  return apps[index];
}
