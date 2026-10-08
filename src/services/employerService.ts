import { EmployerProfile, EmployerProtectedDetails } from "@/types";
import { INITIAL_EMPLOYER_PROFILES } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";

/**
 * ============================================================================
 * FIRESTORE EMPLOYER COLLECTIONS:
 * - Public Directory: `employers/{employerId}`
 * - Protected Business Document: `employerPrivate/{employerId}`
 * ============================================================================
 */

export async function getEmployerProfile(
  userId: string,
  viewerId?: string,
  isAdmin: boolean = false,
  hasApplied: boolean = false
): Promise<EmployerProfile | null> {
  // [FIREBASE CONNECT POINT]: 
  // 1. Fetch public doc: getDoc(doc(db, "employers", userId))
  // 2. If (viewerId === userId || isAdmin || hasApplied)
  //      Fetch private doc: getDoc(doc(db, "employerPrivate", userId))
  //      Combine into profile with protectedDetails & unlockCredits
  const profiles = getStoredData<EmployerProfile[]>("employer_profiles", INITIAL_EMPLOYER_PROFILES);
  const profile = profiles.find((p) => p.userId === userId || p.id === userId) || profiles[0] || null;

  if (!profile) return null;

  const isOwner = viewerId === userId || viewerId === profile.userId;
  if (!isOwner && !isAdmin && !hasApplied) {
    const { protectedDetails, unlockCredits, ...publicProfile } = profile;
    return { ...publicProfile, unlockCredits: 0 } as EmployerProfile;
  }

  return profile;
}

export async function getAllEmployerProfiles(): Promise<EmployerProfile[]> {
  // [FIREBASE CONNECT POINT]: getDocs(collection(db, "employers"))
  const profiles = getStoredData<EmployerProfile[]>("employer_profiles", INITIAL_EMPLOYER_PROFILES);
  return profiles.map(({ protectedDetails, unlockCredits, ...publicProfile }) => ({
    ...publicProfile,
    unlockCredits: 0,
  }) as EmployerProfile);
}

export async function updateEmployerProfile(
  userId: string,
  data: Partial<EmployerProfile> & { protectedDetails?: Partial<EmployerProtectedDetails> }
): Promise<EmployerProfile> {
  // [FIREBASE CONNECT POINT]:
  // const { protectedDetails, unlockCredits, id, userId: uid, ...publicData } = data;
  // await updateDoc(doc(db, "employers", userId), publicData);
  // if (protectedDetails) {
  //   await updateDoc(doc(db, "employerPrivate", userId), protectedDetails);
  // }
  // NOTE: unlockCredits CANNOT be updated directly by client users; it requires admin/server-side context.
  const profiles = getStoredData<EmployerProfile[]>("employer_profiles", INITIAL_EMPLOYER_PROFILES);
  const index = profiles.findIndex((p) => p.userId === userId || p.id === userId);
  if (index !== -1) {
    profiles[index] = { ...profiles[index], ...data };
    setStoredData("employer_profiles", profiles);
    return profiles[index];
  }
  return data as EmployerProfile;
}
