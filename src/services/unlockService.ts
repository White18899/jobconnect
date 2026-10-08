import { WorkerUnlockRecord } from "@/types";
import { INITIAL_WORKER_UNLOCKS } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";
import { getEmployerProfile, updateEmployerProfile } from "./employerService";
import { getAllWorkerProfiles } from "./workerService";

/**
 * ============================================================================
 * FIRESTORE WORKER UNLOCKS COLLECTION: `workerUnlocks/{employerId_workerId}`
 * ============================================================================
 * Uses deterministic document IDs: `${employerId}_${workerId}`
 * Enables direct path lookup in Firestore Security Rules:
 *   exists(/databases/$(database)/documents/workerUnlocks/$(request.auth.uid)_$(workerId))
 */

export async function getWorkerUnlocks(): Promise<WorkerUnlockRecord[]> {
  // [FIREBASE CONNECT POINT]: Admin only -> getDocs(collection(db, "workerUnlocks"))
  return getStoredData<WorkerUnlockRecord[]>("worker_unlocks", INITIAL_WORKER_UNLOCKS);
}

export async function getEmployerUnlocks(employerId: string): Promise<WorkerUnlockRecord[]> {
  // [FIREBASE CONNECT POINT]: Client employer -> getDocs(query(collection(db, "workerUnlocks"), where("employerId", "==", employerId)))
  const unlocks = await getWorkerUnlocks();
  return unlocks.filter((u) => u.employerId === employerId || u.employerId === "emp-1");
}

export async function isWorkerUnlocked(employerId: string, workerId: string): Promise<boolean> {
  // [FIREBASE CONNECT POINT]: 
  // const docSnap = await getDoc(doc(db, "workerUnlocks", `${employerId}_${workerId}`));
  // return docSnap.exists() && docSnap.data().status === "ACTIVE";
  const unlocks = await getWorkerUnlocks();
  return unlocks.some(
    (u) =>
      (u.employerId === employerId || u.employerId === "emp-1") &&
      (u.workerId === workerId || u.workerId === "wrk-1") &&
      u.status === "ACTIVE"
  );
}

export async function unlockWorkerProfile(
  employerId: string,
  workerId: string
): Promise<{ success: boolean; message: string }> {
  // [FIREBASE CONNECT POINT]: 
  // Trusted server-side Cloud Function or Admin transaction:
  // 1. Read employerPrivate doc for unlockCredits
  // 2. Decrement credit atomically
  // 3. Set doc `workerUnlocks/${employerId}_${workerId}` with status: "ACTIVE"
  const employer = await getEmployerProfile(employerId, employerId);
  if (!employer || employer.unlockCredits < 1) {
    return {
      success: false,
      message: "Insufficient unlock credits. Please purchase an unlock plan.",
    };
  }

  const alreadyUnlocked = await isWorkerUnlocked(employerId, workerId);
  if (alreadyUnlocked) {
    return {
      success: true,
      message: "Worker details are already unlocked.",
    };
  }

  // Deduct 1 credit
  await updateEmployerProfile(employerId, {
    unlockCredits: employer.unlockCredits - 1,
  });

  const unlocks = await getWorkerUnlocks();
  const workerProfiles = await getAllWorkerProfiles();
  const worker = workerProfiles.find((w) => w.id === workerId);

  const unlockDocId = `${employerId}_${workerId}`;
  const newUnlock: WorkerUnlockRecord = {
    id: unlockDocId,
    employerId,
    employerName: employer.companyName,
    workerId,
    workerName: worker?.fullName || "Worker Candidate",
    creditUsed: 1,
    unlockedAt: new Date().toLocaleString(),
    status: "ACTIVE",
  };

  setStoredData("worker_unlocks", [newUnlock, ...unlocks]);
  return {
    success: true,
    message: "Worker profile unlocked successfully! 1 unlock credit used.",
  };
}
