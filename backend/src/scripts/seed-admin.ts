/**
 * Seed Admin Account Script for JobConnect
 * Admin accounts can ONLY be provisioned securely via this script or direct D1 migration,
 * NEVER via public OTP signup endpoints.
 *
 * Usage:
 *   npx wrangler d1 execute jobconnect-db --local --command "INSERT OR REPLACE INTO users (id, phone, role, is_blocked, is_verified) VALUES ('usr_admin_master', '+919999999999', 'admin', 0, 1);"
 */

export const ADMIN_SEED_SQL = `
-- Secure bootstrap for JobConnect Super Admin
INSERT OR REPLACE INTO users (id, phone, role, is_blocked, is_verified, created_at, updated_at)
VALUES (
    'usr_admin_master',
    '+919999999999',
    'admin',
    0,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
`;

console.log('To provision an admin user, execute:');
console.log('npx wrangler d1 execute jobconnect-db --local --command "' + ADMIN_SEED_SQL.replace(/\n/g, ' ') + '"');
