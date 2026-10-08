import { PaymentRecord } from "@/types";
import { INITIAL_PAYMENT_RECORDS, INITIAL_NOTIFICATIONS } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";
import { getEmployerProfile, updateEmployerProfile } from "./employerService";
import { getAllApplications } from "./applicationService";

/**
 * ============================================================================
 * FIRESTORE PAYMENTS COLLECTION: `payments/{paymentId}`
 * ============================================================================
 * Security Rules Enforced:
 * - Creation requires: userId == auth.uid, status == 'PENDING', verifiedAt == null
 * - Updates restricted exclusively to Admin (isAdmin())
 */

export async function getAllPaymentRecords(): Promise<PaymentRecord[]> {
  // [FIREBASE CONNECT POINT]: Admin only -> getDocs(collection(db, "payments"))
  return getStoredData<PaymentRecord[]>("payments", INITIAL_PAYMENT_RECORDS);
}

export async function getUserPaymentRecords(userId: string): Promise<PaymentRecord[]> {
  // [FIREBASE CONNECT POINT]: Client user -> getDocs(query(collection(db, "payments"), where("userId", "==", userId)))
  const payments = await getAllPaymentRecords();
  return payments.filter((p) => p.userId === userId || p.userId === "wrk-1" || p.userId === "emp-1");
}

export async function submitPaymentRecord(
  paymentData: Omit<PaymentRecord, "id" | "submittedAt" | "status" | "verifiedAt">
): Promise<PaymentRecord> {
  // [FIREBASE CONNECT POINT]: 
  // addDoc(collection(db, "payments"), { 
  //   ...paymentData, 
  //   userId: auth.currentUser.uid,
  //   submittedAt: serverTimestamp(), 
  //   status: "PENDING", 
  //   verifiedAt: null 
  // })
  const payments = await getAllPaymentRecords();
  const newPayment: PaymentRecord = {
    ...paymentData,
    id: `pay-${Date.now()}`,
    submittedAt: new Date().toLocaleString(),
    status: "PENDING",
    verifiedAt: undefined,
  };
  setStoredData("payments", [newPayment, ...payments]);

  // Admin notification
  const notifs = getStoredData("notifications", INITIAL_NOTIFICATIONS);
  const adminNotif = {
    id: `notif-${Date.now()}`,
    userId: "admin-1",
    role: "admin" as const,
    title: "New Payment Pending Verification",
    message: `${paymentData.userName} submitted ₹${paymentData.amount} payment (UTR: ${paymentData.utrNumber}).`,
    timestamp: "Just now",
    isRead: false,
    type: "payment" as const,
  };
  setStoredData("notifications", [adminNotif, ...notifs]);

  return newPayment;
}

export async function verifyPayment(paymentId: string, action: "VERIFY" | "REJECT"): Promise<PaymentRecord | null> {
  // [FIREBASE CONNECT POINT]: 
  // Restricted to Admin context:
  // updateDoc(doc(db, "payments", paymentId), { status: action === "VERIFY" ? "VERIFIED" : "REJECTED", verifiedAt: serverTimestamp() })
  const payments = await getAllPaymentRecords();
  const index = payments.findIndex((p) => p.id === paymentId);
  if (index === -1) return null;

  const payment = payments[index];
  payment.status = action === "VERIFY" ? "VERIFIED" : "REJECTED";
  payment.verifiedAt = new Date().toLocaleString();

  if (action === "VERIFY") {
    // Grant credits for employer unlock plans
    if (payment.type === "employer_unlock" && payment.unlocksCount) {
      const employer = await getEmployerProfile(payment.userId, "admin-1", true);
      if (employer) {
        await updateEmployerProfile(payment.userId, {
          unlockCredits: (employer.unlockCredits || 0) + payment.unlocksCount,
        });
      }
    }

    // Activate priority badge for worker priority payments
    if (payment.type === "worker_priority" && payment.applicationId) {
      const apps = await getAllApplications();
      const appIdx = apps.findIndex((a) => a.id === payment.applicationId);
      if (appIdx !== -1) {
        apps[appIdx].priorityStatus = "PRIORITY_ACTIVE";
        setStoredData("applications", apps);
      }
    }
  }

  setStoredData("payments", payments);
  return payment;
}
