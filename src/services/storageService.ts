/**
 * ============================================================================
 * FIREBASE STORAGE SERVICE HELPER
 * ============================================================================
 * Handles file validation and upload points for:
 * - Payment Screenshots: payments/{userId}/{fileName}
 * - Worker Resumes: resumes/{workerId}/{fileName}
 */

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  fileName?: string;
  error?: string;
}

const MAX_PAYMENT_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5 MB
const MAX_RESUME_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_SCREENSHOT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/pdf",
];

const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/**
 * Validates and prepares upload path for payment screenshot
 * Storage Path: payments/{userId}/{fileName}
 */
export async function uploadPaymentScreenshot(
  userId: string,
  file: File
): Promise<UploadResult> {
  if (!ALLOWED_SCREENSHOT_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Please upload a valid PNG, JPG, WEBP, or PDF image.",
    };
  }

  if (file.size > MAX_PAYMENT_SCREENSHOT_SIZE) {
    return {
      success: false,
      error: "File size exceeds 5MB limit. Please upload a smaller file.",
    };
  }

  // [FIREBASE CONNECT POINT]: 
  // const storageRef = ref(storage, `payments/${userId}/${Date.now()}_${file.name}`);
  // await uploadBytes(storageRef, file);
  // const url = await getDownloadURL(storageRef);

  return {
    success: true,
    fileUrl: `https://firebasestorage.googleapis.com/v0/b/jobconnect-2b92a.appspot.com/o/payments%2F${userId}%2F${file.name}?alt=media`,
    fileName: file.name,
  };
}

/**
 * Validates and prepares upload path for worker resume
 * Storage Path: resumes/{workerId}/{fileName}
 */
export async function uploadWorkerResume(
  workerId: string,
  file: File
): Promise<UploadResult> {
  if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid resume file type. Please upload PDF, DOC, DOCX, or Image.",
    };
  }

  if (file.size > MAX_RESUME_SIZE) {
    return {
      success: false,
      error: "Resume file size exceeds 10MB limit.",
    };
  }

  // [FIREBASE CONNECT POINT]:
  // const storageRef = ref(storage, `resumes/${workerId}/${Date.now()}_${file.name}`);
  // await uploadBytes(storageRef, file);
  // const url = await getDownloadURL(storageRef);

  return {
    success: true,
    fileUrl: `https://firebasestorage.googleapis.com/v0/b/jobconnect-2b92a.appspot.com/o/resumes%2F${workerId}%2F${file.name}?alt=media`,
    fileName: file.name,
  };
}
