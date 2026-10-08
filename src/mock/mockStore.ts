// Helper to manage mock data fallback persistence in browser localStorage
export function getStoredData<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(`jobconnect_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`jobconnect_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
  }
}
