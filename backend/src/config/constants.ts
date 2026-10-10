export const APP_CONSTANTS = {
  VERIFICATION_FEE_INR: 499,
  DEFAULT_UPI_ID: 'jobconnect@icici',
  DEFAULT_PAYEE_NAME: 'JobConnect',
  OTP: {
    TTL_SECONDS: 300, // 5 minutes
    MAX_REQUESTS_PER_WINDOW: 3,
    RATE_LIMIT_WINDOW_SECONDS: 600, // 10 minutes
    MAX_FAILED_ATTEMPTS: 5,
  },
  SIGNED_URL_EXPIRY_SECONDS: 900, // 15 minutes
  ROLES: ['worker', 'employer', 'admin'] as const,
  APPLICATION_STATUS: {
    APPLIED: 'applied',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    PENDING_VERIFICATION: 'pending_verification',
    UNLOCKED: 'unlocked',
    VERIFICATION_REJECTED: 'verification_rejected',
  } as const,
  PAYMENT_STATUS: {
    AWAITING_PAYMENT: 'awaiting_payment',
    SUBMITTED: 'submitted',
    PENDING_VERIFICATION: 'pending_verification',
    SUCCESSFUL: 'successful',
    REJECTED: 'rejected',
    REFUNDED: 'refunded',
  } as const,
};
