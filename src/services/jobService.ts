import { Job } from "@/types";
import { INITIAL_JOBS } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";

/**
 * ============================================================================
 * FIRESTORE JOB COLLECTION: `jobs/{jobId}`
 * ============================================================================
 */

export async function getAllJobs(): Promise<Job[]> {
  // [FIREBASE CONNECT POINT]: getDocs(query(collection(db, "jobs"), orderBy("createdAt", "desc")))
  return getStoredData<Job[]>("jobs", INITIAL_JOBS);
}

export async function getJobById(id: string): Promise<Job | null> {
  // [FIREBASE CONNECT POINT]: getDoc(doc(db, "jobs", id))
  const jobs = await getAllJobs();
  return jobs.find((j) => j.id === id) || null;
}

export async function getEmployerJobs(employerId: string): Promise<Job[]> {
  // [FIREBASE CONNECT POINT]: getDocs(query(collection(db, "jobs"), where("employerId", "==", employerId)))
  const jobs = await getAllJobs();
  return jobs.filter((j) => j.employerId === employerId);
}

export async function createJob(jobData: Omit<Job, "id" | "createdAt" | "status">): Promise<Job> {
  // [FIREBASE CONNECT POINT]: addDoc(collection(db, "jobs"), { ...jobData, createdAt: serverTimestamp(), status: "active" })
  const jobs = await getAllJobs();
  const newJob: Job = {
    ...jobData,
    id: `job-${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    status: "active",
  };
  const updated = [newJob, ...jobs];
  setStoredData("jobs", updated);
  return newJob;
}

export async function updateJobStatus(id: string, status: "active" | "draft" | "closed"): Promise<Job | null> {
  // [FIREBASE CONNECT POINT]: updateDoc(doc(db, "jobs", id), { status })
  const jobs = await getAllJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;
  jobs[index].status = status;
  setStoredData("jobs", jobs);
  return jobs[index];
}

export async function deleteJob(id: string): Promise<boolean> {
  // [FIREBASE CONNECT POINT]: deleteDoc(doc(db, "jobs", id))
  const jobs = await getAllJobs();
  const filtered = jobs.filter((j) => j.id !== id);
  setStoredData("jobs", filtered);
  return true;
}
