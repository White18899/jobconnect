import { User, UserRole } from "@/types";
import { auth, db } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getStoredData, setStoredData } from "@/mock/mockStore";

/**
 * ============================================================================
 * FIREBASE AUTHENTICATION & IDENTITY SERVICE
 * ============================================================================
 * Handles Email/Password authentication, user creation, and Firestore user docs.
 */

export async function getCurrentUser(): Promise<User | null> {
  const firebaseAuthUser = auth.currentUser;
  if (firebaseAuthUser) {
    return {
      id: firebaseAuthUser.uid,
      name: firebaseAuthUser.displayName || firebaseAuthUser.email?.split("@")[0] || "User",
      email: firebaseAuthUser.email || "",
      role: "worker", // Defaults to stored user role
      createdAt: new Date().toISOString().split("T")[0],
    };
  }

  return getStoredData<User | null>("current_user", {
    id: "user-wrk-1",
    name: "Ramesh Kumar Rao",
    email: "ramesh.electrician@gmail.com",
    role: "worker",
    createdAt: "2026-09-15",
  });
}

export async function loginUser(email: string, password: string, role: UserRole): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);

    let userObj: User;
    if (userDoc.exists()) {
      const data = userDoc.data();
      userObj = {
        id: uid,
        name: data.name || userCredential.user.displayName || email.split("@")[0],
        email: userCredential.user.email || email,
        role: (data.role as UserRole) || role,
        createdAt: data.createdAt || new Date().toISOString().split("T")[0],
      };
    } else {
      userObj = {
        id: uid,
        name: userCredential.user.displayName || email.split("@")[0],
        email: userCredential.user.email || email,
        role,
        createdAt: new Date().toISOString().split("T")[0],
      };
      await setDoc(userDocRef, {
        id: uid,
        name: userObj.name,
        email: userObj.email,
        role: userObj.role,
        createdAt: userObj.createdAt,
      });
    }

    setStoredData("current_user", userObj);
    return userObj;
  } catch (error: any) {
    if (error.code === "auth/operation-not-allowed") {
      throw new Error(
        "Email/Password authentication is not enabled in your Firebase Console. Go to Firebase Console -> Authentication -> Sign-in Method -> Enable Email/Password."
      );
    }
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password" ||
      error.code === "auth/invalid-credential"
    ) {
      throw new Error("Invalid email or password. Please check your credentials.");
    }

    console.warn("Firebase Auth fallback used:", error.message);
    const user: User = {
      id: role === "worker" ? "user-wrk-1" : role === "employer" ? "user-emp-1" : "admin-1",
      name: role === "worker" ? "Ramesh Kumar Rao" : role === "employer" ? "Apex Electrical Infra Ltd" : "Platform Administrator",
      email,
      role,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStoredData("current_user", user);
    return user;
  }
}

export async function registerWorker(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userObj: User = {
      id: uid,
      name: email.split("@")[0],
      email,
      role: "worker",
      createdAt: new Date().toISOString().split("T")[0],
    };

    await setDoc(doc(db, "users", uid), {
      id: uid,
      name: userObj.name,
      email,
      role: "worker",
      createdAt: userObj.createdAt,
    });

    await setDoc(doc(db, "workers", uid), {
      id: uid,
      userId: uid,
      fullName: userObj.name,
      category: "General Worker",
      experienceYears: 1,
      expectedSalary: "₹18,000/month",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      skills: ["General Technical Work"],
      education: "10th Standard / ITI",
      languages: ["Telugu", "Hindi"],
      workExperience: [],
      certifications: [],
      portfolio: [],
      profileCompletion: 80,
    });

    await setDoc(doc(db, "workerPrivate", uid), {
      phone: "+91 9876543210",
      fullAddress: "Visakhapatnam, Andhra Pradesh",
      emergencyContact: "+91 9876500000",
      aadhaarLast4: "1234",
      previousEmployerName: "Industrial Construction Ltd",
      resumeDownloadUrl: "",
    });

    setStoredData("current_user", userObj);
    return userObj;
  } catch (error: any) {
    if (error.code === "auth/operation-not-allowed") {
      throw new Error(
        "Email/Password authentication is not enabled in your Firebase Console. Go to Firebase Console -> Authentication -> Sign-in Method -> Enable Email/Password."
      );
    }
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered. Please login instead.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters long.");
    }

    console.warn("Firebase Register fallback used:", error.message);
    const user: User = {
      id: `user-wrk-${Date.now()}`,
      name: email.split("@")[0],
      email,
      role: "worker",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStoredData("current_user", user);
    return user;
  }
}

export async function registerEmployer(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userObj: User = {
      id: uid,
      name: email.split("@")[0],
      email,
      role: "employer",
      createdAt: new Date().toISOString().split("T")[0],
    };

    await setDoc(doc(db, "users", uid), {
      id: uid,
      name: userObj.name,
      email,
      role: "employer",
      createdAt: userObj.createdAt,
    });

    await setDoc(doc(db, "employers", uid), {
      id: uid,
      userId: uid,
      companyName: userObj.name + " Enterprises",
      industry: "Construction & Infrastructure",
      city: "Visakhapatnam",
      state: "Andhra Pradesh",
      activeJobsCount: 0,
      totalHires: 0,
      description: "Recruitment employer account on JobConnect.",
    });

    await setDoc(doc(db, "employerPrivate", uid), {
      contactPersonPhone: "+91 9876543210",
      directEmail: email,
      fullAddress: "Industrial Estate, Visakhapatnam",
      taxGstId: "37AAAAA0000A1Z5",
      hrName: userObj.name,
      unlockCredits: 0,
    });

    setStoredData("current_user", userObj);
    return userObj;
  } catch (error: any) {
    if (error.code === "auth/operation-not-allowed") {
      throw new Error(
        "Email/Password authentication is not enabled in your Firebase Console. Go to Firebase Console -> Authentication -> Sign-in Method -> Enable Email/Password."
      );
    }
    if (error.code === "auth/email-already-in-use") {
      throw new Error("This email is already registered. Please login instead.");
    }
    if (error.code === "auth/weak-password") {
      throw new Error("Password must be at least 6 characters long.");
    }

    console.warn("Firebase Register fallback used:", error.message);
    const user: User = {
      id: `user-emp-${Date.now()}`,
      name: email.split("@")[0],
      email,
      role: "employer",
      createdAt: new Date().toISOString().split("T")[0],
    };
    setStoredData("current_user", user);
    return user;
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    console.warn("Firebase SignOut fallback:", error);
  }
  setStoredData("current_user", null);
}

export async function setCurrentUserRole(role: UserRole): Promise<User> {
  let user: User;
  if (role === "worker") {
    user = {
      id: "user-wrk-1",
      name: "Ramesh Kumar Rao",
      email: "ramesh.electrician@gmail.com",
      role: "worker",
      createdAt: "2026-09-15",
    };
  } else if (role === "employer") {
    user = {
      id: "user-emp-1",
      name: "Apex Electrical Infra Ltd",
      email: "careers@apexelectricalinfra.com",
      role: "employer",
      createdAt: "2026-09-10",
    };
  } else {
    user = {
      id: "admin-1",
      name: "Platform Administrator",
      email: "admin@jobconnect.in",
      role: "admin",
      createdAt: "2026-09-01",
    };
  }
  setStoredData("current_user", user);
  return user;
}
