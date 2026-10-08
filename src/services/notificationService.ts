import { NotificationItem } from "@/types";
import { INITIAL_NOTIFICATIONS } from "@/mock/mockData";
import { getStoredData, setStoredData } from "@/mock/mockStore";

/**
 * ============================================================================
 * FIRESTORE NOTIFICATIONS COLLECTION: `notifications/{notificationId}`
 * ============================================================================
 */

export async function getNotifications(role: string): Promise<NotificationItem[]> {
  // [FIREBASE CONNECT POINT]: getDocs(query(collection(db, "notifications"), where("role", "==", role)))
  const notifs = getStoredData<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
  return notifs.filter((n) => n.role === role);
}

export async function markNotificationAsRead(id: string): Promise<void> {
  // [FIREBASE CONNECT POINT]: updateDoc(doc(db, "notifications", id), { isRead: true })
  const notifs = getStoredData<NotificationItem[]>("notifications", INITIAL_NOTIFICATIONS);
  const index = notifs.findIndex((n) => n.id === id);
  if (index !== -1) {
    notifs[index].isRead = true;
    setStoredData("notifications", notifs);
  }
}
