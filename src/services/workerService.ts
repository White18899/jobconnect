import { WorkerProfile, WorkerProtectedDetails } from "@/types";
import { INITIAL_WORKER_PROFILES } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";

/**
 * ============================================================================
 * FIRESTORE WORKER COLLECTIONS:
 * - Public Directory: `workers/{workerId}`
 * - Protected PII Document: `workerPrivate/{workerId}`
 * ============================================================================
 */

export async function getWorkerProfile(
  userId: string,
  viewerId?: string,
  isAdmin: boolean = false,
  isUnlocked: boolean = false
): Promise<WorkerProfile | null> {
  // [FIREBASE CONNECT POINT]: 
  // 1. Fetch public doc: getDoc(doc(db, "workers", userId))
  // 2. Check auth: if (viewerId === userId || isAdmin || isUnlocked)
  //      Fetch private doc: getDoc(doc(db, "workerPrivate", userId))
  //      Combine into profile with protectedDetails
  const profiles = getStoredData<WorkerProfile[]>("worker_profiles", INITIAL_WORKER_PROFILES);
  const profile = profiles.find((p) => p.userId === userId || p.id === userId) || profiles[0] || null;

  if (!profile) return null;

  // If not owner, admin, or unlocked employer, omit sensitive PII
  const isOwner = viewerId === userId || viewerId === profile.userId;
  if (!isOwner && !isAdmin && !isUnlocked) {
    const { protectedDetails, ...publicProfile } = profile;
    return publicProfile as WorkerProfile;
  }

  return profile;
}

export async function getAllWorkerProfiles(): Promise<WorkerProfile[]> {
  // [FIREBASE CONNECT POINT]: getDocs(collection(db, "workers"))
  // Returns public worker profile cards for public browsing/search
  const profiles = getStoredData<WorkerProfile[]>("worker_profiles", INITIAL_WORKER_PROFILES);
  return profiles.map(({ protectedDetails, ...publicProfile }) => publicProfile as WorkerProfile);
}

export async function updateWorkerProfile(
  userId: string,
  data: Partial<WorkerProfile> & { protectedDetails?: Partial<WorkerProtectedDetails> }
): Promise<WorkerProfile> {
  // [FIREBASE CONNECT POINT]:
  // const { protectedDetails, id, userId: uid, ...publicData } = data;
  // await updateDoc(doc(db, "workers", userId), publicData);
  // if (protectedDetails) {
  //   await updateDoc(doc(db, "workerPrivate", userId), protectedDetails);
  // }
  const profiles = getStoredData<WorkerProfile[]>("worker_profiles", INITIAL_WORKER_PROFILES);
  const index = profiles.findIndex((p) => p.userId === userId || p.id === userId);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...data };
    setStoredData("worker_profiles", profiles);
    return profiles[index];
  }
  return data as WorkerProfile;
}
