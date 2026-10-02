export function maskIdNumber(rawId: string): string {
  if (!rawId) return '';
  const cleaned = rawId.replace(/[\s-]/g, '');
  if (cleaned.length <= 4) return '****';
  const visible = cleaned.slice(-4);
  return `XXXX-XXXX-${visible}`;
}

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  if (phone.length < 10) return '+91 ******';
  // Keep country code and last 3 digits
  const suffix = phone.slice(-3);
  const prefix = phone.slice(0, 5);
  return `${prefix}*****${suffix}`;
}

export function sanitizeWorkerProfile(worker: any, isUnlocked: boolean = false) {
  if (!worker) return null;
  const { user_phone, phone, id_number_raw, ...safeWorker } = worker;

  return {
    ...safeWorker,
    // Phone is strictly hidden unless unlocked
    phone: isUnlocked ? (user_phone || phone) : maskPhoneNumber(user_phone || phone),
    isPhoneUnlocked: isUnlocked,
    // Masked ID is always safe, raw is never returned
    id_number_masked: worker.id_number_masked || (id_number_raw ? maskIdNumber(id_number_raw) : null),
  };
}

export function sanitizeEmployerProfile(employer: any, isUnlocked: boolean = false) {
  if (!employer) return null;
  const { exact_address, latitude, longitude, ...safeEmployer } = employer;

  if (isUnlocked) {
    return {
      ...safeEmployer,
      exact_address,
      latitude,
      longitude,
      isAddressUnlocked: true,
      map_url: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    };
  }

  return {
    ...safeEmployer,
    exact_address: undefined,
    latitude: undefined,
    longitude: undefined,
    isAddressUnlocked: false,
    // Only public area and city are exposed
    location_summary: `${employer.area}, ${employer.city}`,
  };
}
