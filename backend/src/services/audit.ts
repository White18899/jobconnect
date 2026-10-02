export async function logAdminAudit(
  db: D1Database,
  adminId: string,
  action: 'approve' | 'reject' | 'refund' | 'block' | 'unblock' | 'delete_job',
  targetType: 'worker' | 'employer' | 'payment' | 'job' | 'user',
  targetId: string,
  details: Record<string, any> = {},
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const auditId = 'aud_' + crypto.randomUUID();
  await db.prepare(`
    INSERT INTO audit_logs (id, admin_id, action, target_type, target_id, ip_address, user_agent, details_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    auditId,
    adminId,
    action,
    targetType,
    targetId,
    ipAddress || 'unknown',
    userAgent || 'unknown',
    JSON.stringify(details)
  ).run();
}
