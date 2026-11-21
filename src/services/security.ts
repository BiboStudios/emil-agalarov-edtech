/**
 * KİBERTƏHLÜKƏSİZLİK VƏ AUTENTİFİKASİYA MODULU
 * 
 * - Şifrələrin SHA-256 + Salt ilə kriptoqrafik heşlənməsi (Web Crypto API)
 * - Brute-force və lüğət hücumlarına qarşı qorunma (Rate Limiting & Account Lockout)
 * - Vaxt məhdudiyyətli kriptoqrafik sessiya idarəetməsi (Session Expiry)
 * - Təhlükəsizlik hadisələri jurnalı (Security Audit Logging)
 */

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: 'SUCCESSFUL_LOGIN' | 'FAILED_LOGIN' | 'ACCOUNT_LOCKED' | 'PASSWORD_CHANGED' | 'LOGOUT' | 'SESSION_EXPIRED';
  ipOrDevice: string;
  details: string;
  severity: 'info' | 'warning' | 'danger';
}

export interface SecurityConfig {
  teacherUsername: string; // 'emil.agalarov' or 'emil.agalarov@edutech.az'
  passwordHash: string;
  salt: string;
  failedAttempts: number;
  lockoutUntil: number | null; // timestamp ms
  currentSessionToken: string | null;
  sessionExpiresAt: number | null;
}

const STORAGE_KEYS = {
  SECURITY_CONFIG: 'emil_sec_config',
  AUDIT_LOGS: 'emil_sec_audit_logs',
};

// Initial default password: EmilTeacher#2026!
// Salt: a0f49c7e81b2
// Generated with crypto.subtle SHA-256
const INITIAL_SALT = 'a0f49c7e81b2';
// We will generate hash on init if not present

// Utility to convert ArrayBuffer to hex string
function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Cryptographically secure hash with SHA-256 and unique salt
export async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bufferToHex(hashBuffer);
}

// Generate random cryptographic salt or token
export function generateSecureToken(): string {
  return crypto.randomUUID();
}

// Initialize security configuration if not already configured
export async function initializeSecurity(): Promise<SecurityConfig> {
  const stored = localStorage.getItem(STORAGE_KEYS.SECURITY_CONFIG);
  if (stored) {
    try {
      return JSON.parse(stored) as SecurityConfig;
    } catch {
      // fallback
    }
  }

  // Initial secure default setup:
  // Username: emil.agalarov or emil.agalarov@edutech.az
  // Password: EmilTeacher#2026!
  const defaultPassword = 'EmilTeacher#2026!';
  const initialHash = await hashPassword(defaultPassword, INITIAL_SALT);

  const initialConfig: SecurityConfig = {
    teacherUsername: 'emil.agalarov',
    passwordHash: initialHash,
    salt: INITIAL_SALT,
    failedAttempts: 0,
    lockoutUntil: null,
    currentSessionToken: null,
    sessionExpiresAt: null
  };

  localStorage.setItem(STORAGE_KEYS.SECURITY_CONFIG, JSON.stringify(initialConfig));
  addSecurityAuditLog('SUCCESSFUL_LOGIN', 'Sistem ilk dəfə təhlükəsiz şəkildə inisializasiya edildi.', 'info');
  return initialConfig;
}

export function getSecurityConfig(): SecurityConfig {
  const stored = localStorage.getItem(STORAGE_KEYS.SECURITY_CONFIG);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback
    }
  }
  return {
    teacherUsername: 'emil.agalarov',
    passwordHash: '',
    salt: INITIAL_SALT,
    failedAttempts: 0,
    lockoutUntil: null,
    currentSessionToken: null,
    sessionExpiresAt: null
  };
}

export function saveSecurityConfig(config: SecurityConfig): void {
  localStorage.setItem(STORAGE_KEYS.SECURITY_CONFIG, JSON.stringify(config));
}

// Audit Logs
export function getSecurityAuditLogs(): SecurityAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSecurityAuditLog(
  event: SecurityAuditLog['event'],
  details: string,
  severity: SecurityAuditLog['severity'] = 'info'
): void {
  try {
    const logs = getSecurityAuditLogs();
    const newLog: SecurityAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleString('az-AZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      event,
      ipOrDevice: navigator.userAgent.includes('Mobile') ? 'Mobil Cihaz (Brauzer)' : 'Masaüstü (Mac/PC Brauzer)',
      details,
      severity
    };
    const updated = [newLog, ...logs].slice(0, 50); // keep last 50 events
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(updated));
  } catch {
    // silent
  }
}

// Constant-time string comparison to prevent timing attacks
export function constantTimeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

// Authentication verification with rate limiting
export interface AuthResult {
  success: boolean;
  errorMessage?: string;
  remainingAttempts?: number;
  lockoutSeconds?: number;
  sessionToken?: string;
}

export async function verifyTeacherCredentials(usernameInput: string, passwordInput: string): Promise<AuthResult> {
  const config = getSecurityConfig();
  const now = Date.now();

  // 1. Check if account is currently in lockout
  if (config.lockoutUntil && config.lockoutUntil > now) {
    const remainingSecs = Math.ceil((config.lockoutUntil - now) / 1000);
    return {
      success: false,
      errorMessage: `Təhlükəsizlik səbəbilə giriş bloklanıb. Zəhmət olmasa ${remainingSecs} saniyə sonra yenidən cəhd edin.`,
      lockoutSeconds: remainingSecs
    };
  }

  // 2. Normalize and check username
  const cleanUser = usernameInput.trim().toLowerCase();
  const validUsernames = [
    config.teacherUsername.toLowerCase(),
    'emil.agalarov@edutech.az',
    'emil.agalarov',
    'admin'
  ];
  const isUsernameValid = validUsernames.includes(cleanUser);

  // 3. Compute hash with stored salt
  const inputHash = await hashPassword(passwordInput, config.salt);
  const isPasswordValid = constantTimeCompare(inputHash, config.passwordHash);

  // 4. Verification Check
  if (isUsernameValid && isPasswordValid) {
    // Reset failed attempts on success
    const sessionToken = generateSecureToken();
    const sessionExpiresAt = now + 2 * 60 * 60 * 1000; // 2 hours session validity

    config.failedAttempts = 0;
    config.lockoutUntil = null;
    config.currentSessionToken = sessionToken;
    config.sessionExpiresAt = sessionExpiresAt;
    saveSecurityConfig(config);

    addSecurityAuditLog('SUCCESSFUL_LOGIN', `Müəllim paneli üçün uğurlu giriş qeydə alındı (${cleanUser}).`, 'info');

    return {
      success: true,
      sessionToken
    };
  } else {
    // Increment failed attempts
    const newFailedCount = (config.failedAttempts || 0) + 1;
    config.failedAttempts = newFailedCount;

    const maxAllowed = 5;
    if (newFailedCount >= maxAllowed) {
      const lockoutDurationMs = 60 * 1000; // 60 seconds lockout
      config.lockoutUntil = now + lockoutDurationMs;
      saveSecurityConfig(config);

      addSecurityAuditLog(
        'ACCOUNT_LOCKED',
        `5 ardıcıl uğursuz giriş cəhdi səbəbilə sistem 60 saniyəlik bloklandı! Giriş cəhdi: ${cleanUser}`,
        'danger'
      );

      return {
        success: false,
        errorMessage: 'Çoxsaylı yanlış giriş cəhdi! Kiber-təhlükəsizlik qaydalarına əsasən hesab 60 saniyəlik bloklandı.',
        lockoutSeconds: 60
      };
    } else {
      saveSecurityConfig(config);
      const remaining = maxAllowed - newFailedCount;

      addSecurityAuditLog(
        'FAILED_LOGIN',
        `Uğursuz giriş cəhdi (${cleanUser}). Qalan cəhd sayı: ${remaining}`,
        'warning'
      );

      return {
        success: false,
        errorMessage: `İstifadəçi adı və ya şifrə yanlışdır. Qalan cəhd sayı: ${remaining}`,
        remainingAttempts: remaining
      };
    }
  }
}

// Change teacher password with complexity checks
export async function changeTeacherPassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  const config = getSecurityConfig();

  // Verify current password
  const currentHash = await hashPassword(currentPassword, config.salt);
  if (!constantTimeCompare(currentHash, config.passwordHash)) {
    return { success: false, error: 'Hazırkı şifrə yanlışdır.' };
  }

  // Password complexity: at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  if (newPassword.length < 8) {
    return { success: false, error: 'Yeni şifrə ən azı 8 simvoldan ibarət olmalıdır.' };
  }
  if (!/[A-Z]/.test(newPassword)) {
    return { success: false, error: 'Yeni şifrədə ən azı bir böyük hərf (A-Z) olmalıdır.' };
  }
  if (!/[a-z]/.test(newPassword)) {
    return { success: false, error: 'Yeni şifrədə ən azı bir kiçik hərf (a-z) olmalıdır.' };
  }
  if (!/[0-9]/.test(newPassword)) {
    return { success: false, error: 'Yeni şifrədə ən azı bir rəqəm (0-9) olmalıdır.' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
    return { success: false, error: 'Yeni şifrədə ən azı bir xüsusi simvol (!@#$%^&*...) olmalıdır.' };
  }

  // Generate new random salt
  const newSalt = generateSecureToken().slice(0, 12);
  const newHash = await hashPassword(newPassword, newSalt);

  config.salt = newSalt;
  config.passwordHash = newHash;
  saveSecurityConfig(config);

  addSecurityAuditLog('PASSWORD_CHANGED', 'Müəllim şifrəsi uğurla yeniləndi.', 'info');
  return { success: true };
}

// Validate active session
export function isSessionValid(): boolean {
  const config = getSecurityConfig();
  if (!config.currentSessionToken || !config.sessionExpiresAt) {
    return false;
  }
  const now = Date.now();
  if (now > config.sessionExpiresAt) {
    return false;
  }
  return true;
}

export function terminateSession(): void {
  const config = getSecurityConfig();
  config.currentSessionToken = null;
  config.sessionExpiresAt = null;
  saveSecurityConfig(config);
  addSecurityAuditLog('LOGOUT', 'Sessiya təhlükəsiz şəkildə sonlandırıldı.', 'info');
}
