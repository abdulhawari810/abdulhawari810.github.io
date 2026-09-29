/**
 * Normalisasi error (Error biasa, FirebaseError, hasil fetch, dll) menjadi
 * informasi yang layak ditampilkan ke user:
 *
 * - kode HTTP
 * - teks status HTTP
 * - pesan & stack trace (HANYA dipakai di development)
 * - apakah termasuk error jaringan
 *
 * Modul ini tidak meng-import React supaya aman dipakai di mana saja.
 */

/** Kode yang dianggap sebagai "masalah jaringan / server tidak terjangkau". */
const NETWORK_STATUS = new Set([0, 502, 503, 504]);

/**
 * Pemetaan kode Firebase SDK -> HTTP status code yang umum dipakai.
 * Dipakai hanya sebagai fallback ketika error tidak membawa status eksplisit.
 */
const FIREBASE_STATUS_MAP = {
  // Auth
  "auth/network-request-failed": 503,
  "auth/too-many-requests": 429,
  "auth/user-not-found": 404,
  "auth/invalid-credential": 401,
  "auth/wrong-password": 401,
  "auth/user-disabled": 403,
  "auth/invalid-email": 400,
  "auth/requires-recent-login": 401,
  "auth/operation-not-allowed": 403,
  "auth/invalid-api-key": 500,
  "auth/configuration-not-found": 500,

  // Firestore
  "firestore/unavailable": 503,
  "firestore/permission-denied": 403,
  "firestore/unauthenticated": 401,
  "firestore/not-found": 404,
  "firestore/cancelled": 499,
  "firestore/deadline-exceeded": 504,
  "firestore/resource-exhausted": 429,
  "firestore/failed-precondition": 400,
  "firestore/aborted": 409,
  "firestore/already-exists": 409,
  "firestore/invalid-argument": 400,
  "firestore/out-of-range": 400,
  "firestore/internal-error": 500,
  "firestore/unimplemented": 501,
};

/** Teks status HTTP standar agar production tetap informatif. */
const HTTP_STATUS_TEXT = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
  429: "Too Many Requests",
  499: "Client Closed Request",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
  504: "Gateway Timeout",
};

/** Ubah nilai apa pun menjadi status code HTTP yang valid, atau null. */
function toNumericStatus(value) {
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return null;
  if (parsed < 100 || parsed > 599) return null;
  return Math.trunc(parsed);
}

/** True saat browser tahu perangkat sedang offline. */
export function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

/**
 * Ambil kode HTTP dari error.
 * Urutan prioritas:
 * 1. perangkat offline            -> 503
 * 2. status eksplisit di error    -> dipakai apa adanya
 * 3. kode numerik ("503", 503)    -> dipakai apa adanya
 * 4. kode Firebase ("auth/...")   -> dipetakan lewat FIREBASE_STATUS_MAP
 * 5. TypeError "Failed to fetch"  -> 503
 * 6. fallback                     -> 500
 */
export function resolveHttpCode(error) {
  if (isOffline()) return 503;
  if (!error) return 500;

  const explicit = [
    error.status,
    error.statusCode,
    error.httpStatus,
    error.response?.status,
    error.cause?.status,
    error.cause?.statusCode,
  ];
  for (const candidate of explicit) {
    const numeric = toNumericStatus(candidate);
    if (numeric) return numeric;
  }

  const raw = error.code ?? error.name;
  const numeric = toNumericStatus(raw);
  if (numeric) return numeric;

  if (typeof raw === "string") {
    const mapped = FIREBASE_STATUS_MAP[raw.toLowerCase()];
    if (mapped) return mapped;
  }

  const message = getErrorMessage(error);
  if (/failed to fetch|networkerror|network request failed|load failed|timeout/i.test(message)) {
    return 503;
  }

  return 500;
}

/** Teks status HTTP yang ramah dibaca. */
export function getHttpStatusText(code) {
  return HTTP_STATUS_TEXT[code] ?? "Error";
}

/** True bila error ini karena masalah koneksi/server, bukan bug di kode. */
export function isNetworkError(error, code = resolveHttpCode(error)) {
  return isOffline() || NETWORK_STATUS.has(code);
}

/** Pesan error apa adanya - HANYA tampil di development. */
export function getErrorMessage(error) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  return error.message || String(error);
}

/** Stack trace - HANYA tampil di development. */
export function getErrorStack(error) {
  return typeof error?.stack === "string" ? error.stack : "";
}

/** Kode asli dari error (mis. "auth/network-request-failed") - HANYA di development. */
export function getRawErrorCode(error) {
  if (!error || typeof error !== "object") return "";
  return String(error.code ?? error.name ?? "");
}

/** Ringkasan satu blok teks untuk tombol "Copy detail" di development. */
export function buildErrorReport({ error, componentStack } = {}) {
  const parts = [
    `[${getHttpStatusText(resolveHttpCode(error))}]`,
    getErrorMessage(error),
  ];
  if (getRawErrorCode(error)) parts.push(`code: ${getRawErrorCode(error)}`);
  if (componentStack) parts.push(componentStack);
  if (getErrorStack(error)) parts.push(getErrorStack(error));
  return parts.join("\n\n");
}
